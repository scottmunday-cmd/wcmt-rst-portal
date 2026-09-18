import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { sendSms, normalizeAuMobile } from "@/lib/sms";

/**
 * Public endpoint behind the homepage's "Request Callback" button (see
 * RequestCallbackForm.tsx) — no auth, deliberately, since it's aimed at
 * prospective students who haven't signed up yet. A valid submission does
 * two things:
 *   1. Logs the lead to `enquiries` (enquiry_type "callback_request") —
 *      that table has existed since 0001_core_schema.sql but nothing had
 *      ever written to it until now. email is nullable as of
 *      0012_callback_requests.sql specifically so this can reuse it
 *      without asking for one.
 *   2. Texts OWNER_MOBILE_NUMBER via ClickSend (src/lib/sms.ts) so Scott
 *      finds out immediately, rather than needing to check a dashboard.
 *      Reuses sendSms() with profileId: null — sms_logs.profile_id is
 *      nullable for exactly this kind of send.
 *
 * The enquiry is logged even if OWNER_MOBILE_NUMBER isn't configured or
 * the SMS send fails — a visitor's request is never silently lost just
 * because a text didn't go out; see /admin (enquiries) as the fallback way
 * to notice it. Note: the plan is /faq's own contact note stays low-key on
 * purpose (Scott's request, 18 September 2026) — worth keeping this the
 * more prominent path in rather than adding more direct-contact surfaces.
 */
export async function POST(request: NextRequest) {
  let body: { name?: string; phone?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const name = body.name?.trim().slice(0, 200);
  const rawPhone = body.phone?.trim();

  if (!name) {
    return NextResponse.json({ error: "Please enter your name" }, { status: 400 });
  }

  const normalized = rawPhone ? normalizeAuMobile(rawPhone) : null;
  if (!normalized) {
    return NextResponse.json(
      { error: "Please enter a valid Australian mobile number" },
      { status: 400 }
    );
  }

  const admin = createAdminClient();
  const { error: insertError } = await admin.from("enquiries").insert({
    full_name: name,
    mobile: normalized,
    enquiry_type: "callback_request",
    message: "Requested a callback via the website's 'Request Callback' button.",
  });

  if (insertError) {
    console.error("[callback-request] failed to log enquiry", insertError);
    return NextResponse.json(
      { error: "Something went wrong — please try again, or call/text directly." },
      { status: 500 }
    );
  }

  const ownerMobile = process.env.OWNER_MOBILE_NUMBER;
  if (!ownerMobile) {
    console.error(
      "[callback-request] OWNER_MOBILE_NUMBER not configured — enquiry logged but no SMS sent"
    );
    // Still a success from the visitor's point of view: their request is
    // safely in `enquiries` either way, it just won't page Scott by text.
    return NextResponse.json({ ok: true });
  }

  await sendSms({
    profileId: null,
    mobile: ownerMobile,
    templateName: "callback_request",
    message: `New callback request via the website: ${name}, ${normalized}.`,
  });

  return NextResponse.json({ ok: true });
}
