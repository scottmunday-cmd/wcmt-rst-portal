import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { sendSms, renderSmsTemplate } from "@/lib/sms";

/**
 * Sends the "your assessment is in 48 hours" SMS reminder. Triggered by
 * Vercel Cron (see vercel.json — runs hourly) rather than on-demand, since
 * nothing else in this app schedules anything yet (see the comment on
 * REMINDER_WINDOW_HOURS below for why hourly).
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
const PERTH_UTC_OFFSET = "+08:00";

// Cron runs hourly; a target 2-hour window (47h-49h out) guarantees every
// booking passes through it exactly once even if a run is a little late,
// without ever double-covering — reminder_sent_at is the real de-dupe
// guard regardless, this window just keeps each run's query small.
const WINDOW_MIN_HOURS = 47;
const WINDOW_MAX_HOURS = 49;

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

  // Narrow to the next few days server-side (cheap index-friendly filter)
  // — the exact 47h/49h cut happens in JS below, where AWST's fixed
  // offset makes the math trivial.
  const today = new Date(now).toISOString().slice(0, 10);
  const in4Days = new Date(now + 4 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

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
    .gte("assessment_slots.assessment_date", today)
    .lte("assessment_slots.assessment_date", in4Days)
    .returns<BookingRow[]>();

  if (error) {
    console.error("[cron:assessment-reminders] query failed", error);
    return NextResponse.json({ error: "Query failed" }, { status: 500 });
  }

  let sent = 0;
  let skipped = 0;

  for (const booking of bookings ?? []) {
    const slot = booking.assessment_slots;
    const profileId = booking.students?.profile_id;
    if (!slot || !slot.active || !profileId) {
      skipped++;
      continue;
    }

    const slotDate = new Date(`${slot.assessment_date}T${slot.assessment_time}${PERTH_UTC_OFFSET}`);
    const hoursUntil = (slotDate.getTime() - now) / (1000 * 60 * 60);
    if (hoursUntil < WINDOW_MIN_HOURS || hoursUntil > WINDOW_MAX_HOURS) {
      continue; // not this booking's turn yet (or already past it)
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
    // (bad number, ClickSend outage) shouldn't retry hourly and risk a
    // burst of duplicate texts once whatever was wrong is fixed. sms_logs
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
