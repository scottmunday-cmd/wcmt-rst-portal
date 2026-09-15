import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { sendSms, renderSmsTemplate } from "@/lib/sms";

/**
 * Sends the "your assessment is in 2 days" SMS reminder. Triggered by
 * Vercel Cron (see vercel.json — runs once daily, at 00:00 UTC = 8am
 * Perth time) rather than on-demand, since nothing else in this app
 * schedules anything yet.
 *
 * Originally built to run hourly with a precise 47h-49h window, but
 * Vercel's Hobby plan only allows daily cron schedules (Pro is needed for
 * anything more frequent) — rather than pay for Pro just for this, this
 * now matches by calendar date instead of an hour-precision window: once
 * a day, it reminds everyone whose assessment is exactly 2 days away
 * (Perth-local date). The trade-off is the reminder always goes out at
 * ~8am rather than exactly 48 hours before the appointment time — a
 * fine trade for a text that just says "in 2 days", and it's free.
 *
 * Auth: Vercel automatically sends `Authorization: Bearer $CRON_SECRET`
 * on requests it triggers itself, as long as a CRON_SECRET env var is set
 * on the project (see .env.example) — this route just checks that header
 * matches, so nobody else can trigger mass SMS sends by hitting this URL.
 * The same header lets Scott (or anyone testing) trigger a run manually.
 */

// WA (Australia/Perth, AWST) never observes daylight saving, so it's a
// fixed UTC+8 year-round — no timezone-library/DB-timezone-conversion
// needed, just a constant offset.
const PERTH_UTC_OFFSET_MS = 8 * 60 * 60 * 1000;
const DAYS_BEFORE = 2;

interface BookingRow {
  id: string;
  reminder_sent_at: string | null;
  students: { profile_id: string } | null;
  assessment_slots: {
    assessment_date: string;
    assessment_time: string;
    active: boolean;
    assessment_locations: { name: string } | null;
  } | null;
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const now = Date.now();

  // "Today" in Perth-local terms, then +2 days — the one calendar date
  // this run cares about. Cron fires at 00:00 UTC (8am Perth), so adding
  // the fixed AWST offset before slicing the date is enough; no
  // timezone library needed.
  const perthNowIso = new Date(now + PERTH_UTC_OFFSET_MS).toISOString();
  const perthToday = perthNowIso.slice(0, 10);
  const targetDate = new Date(now + PERTH_UTC_OFFSET_MS + DAYS_BEFORE * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

  const { data: bookings, error } = await admin
    .from("assessment_bookings")
    .select(
      `id, reminder_sent_at,
       students!inner ( profile_id ),
       assessment_slots!inner (
         assessment_date, assessment_time, active,
         assessment_locations ( name )
       )`
    )
    .eq("status", "booked")
    .is("reminder_sent_at", null)
    .eq("assessment_slots.assessment_date", targetDate)
    .returns<BookingRow[]>();

  if (error) {
    console.error("[cron:assessment-reminders] query failed", error);
    return NextResponse.json({ error: "Query failed" }, { status: 500 });
  }

  console.log("[cron:assessment-reminders] run", { perthToday, targetDate, candidates: bookings?.length ?? 0 });

  let sent = 0;
  let skipped = 0;

  for (const booking of bookings ?? []) {
    const slot = booking.assessment_slots;
    const profileId = booking.students?.profile_id;
    if (!slot || !slot.active || !profileId) {
      skipped++;
      continue;
    }

    const { data: profile } = await admin
      .from("profiles")
      .select("first_name, mobile, sms_consent")
      .eq("id", profileId)
      .single<{ first_name: string | null; mobile: string | null; sms_consent: boolean }>();

    if (!profile?.sms_consent || !profile.mobile) {
      skipped++;
      // Still mark it sent so we don't re-check this booking every hour —
      // there's nothing to send and that won't change.
      await admin
        .from("assessment_bookings")
        .update({ reminder_sent_at: new Date().toISOString() })
        .eq("id", booking.id);
      continue;
    }

    const message = await renderSmsTemplate("assessment_reminder_48h", {
      first_name: profile.first_name ?? "there",
      date: slot.assessment_date,
      time: slot.assessment_time.slice(0, 5),
      location: slot.assessment_locations?.name ?? "your booked location",
    });

    const result = await sendSms({
      profileId,
      mobile: profile.mobile,
      templateName: "assessment_reminder_48h",
      message,
    });

    // Marked sent regardless of delivery success — a real send failure
    // (bad number, ClickSend outage) shouldn't retry on tomorrow's run and
    // risk a confusing late duplicate text once whatever was wrong is
    // fixed. sms_logs
    // (written by sendSms itself) is the record of what actually happened.
    await admin
      .from("assessment_bookings")
      .update({ reminder_sent_at: new Date().toISOString() })
      .eq("id", booking.id);

    if (result.sent) sent++;
    else skipped++;
  }

  return NextResponse.json({ checked: bookings?.length ?? 0, sent, skipped });
}
