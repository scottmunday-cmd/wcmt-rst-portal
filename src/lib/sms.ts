import { createAdminClient } from "@/lib/supabase/server";

/**
 * SMS sending via ClickSend (see .env.example — CLICKSEND_USERNAME /
 * CLICKSEND_API_KEY). ClickSend has no first-party JS SDK worth using, so
 * this just calls their REST API directly.
 *
 * Every send attempt is logged to sms_logs (delivery_status records what
 * happened, including "skipped_*" outcomes) — this is both an audit trail
 * and how the reminder cron avoids re-sending (via
 * assessment_bookings.reminder_sent_at, set by the caller after a
 * successful send — see src/app/api/cron/assessment-reminders/route.ts).
 */

const CLICKSEND_URL = "https://rest.clicksend.com/v3/sms/send";

// message_body from sms_templates, or the DEFAULT_TEMPLATES fallback
// below, filled with these placeholder values.
export function fillTemplate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => vars[key] ?? match);
}

// Used only if a template row is missing/inactive in sms_templates — keeps
// sends working even if that table gets edited into a bad state.
const DEFAULT_TEMPLATES: Record<string, string> = {
  booking_confirmation:
    "Hi {{first_name}}, thanks for booking {{product_name}} with West Coast Marine Training! {{details}} Reply STOP to opt out of SMS.",
  assessment_reminder_48h:
    "Hi {{first_name}}, reminder: your RST Assessment is coming up in 2 days — {{date}} at {{time}}, {{location}}. See you there! — West Coast Marine Training. Reply STOP to opt out.",
};

/**
 * Loads a template's message_body from sms_templates (falling back to
 * DEFAULT_TEMPLATES if missing/inactive), and fills in {{placeholders}}.
 */
export async function renderSmsTemplate(
  templateName: string,
  vars: Record<string, string>
): Promise<string> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("sms_templates")
    .select("message_body")
    .eq("template_name", templateName)
    .eq("active", true)
    .maybeSingle<{ message_body: string }>();

  const template = data?.message_body ?? DEFAULT_TEMPLATES[templateName];
  if (!template) {
    throw new Error(`No sms template found for "${templateName}" and no default exists`);
  }
  return fillTemplate(template, vars);
}

// ClickSend (like most SMS gateways) wants E.164 — normalizes common
// Australian formats (04xx xxx xxx, +61..., 61...) to +614xxxxxxxx. Returns
// null if the number doesn't look like a usable Australian mobile, so
// callers can skip the send and log why rather than fire a doomed request.
export function normalizeAuMobile(raw: string): string | null {
  const digits = raw.replace(/[^\d+]/g, "");
  if (/^\+614\d{8}$/.test(digits)) return digits;
  if (/^614\d{8}$/.test(digits)) return `+${digits}`;
  if (/^04\d{8}$/.test(digits)) return `+61${digits.slice(1)}`;
  return null;
}

interface SendSmsParams {
  profileId: string;
  mobile: string;
  templateName: string;
  message: string;
}

interface SendSmsResult {
  sent: boolean;
  status: string;
}

/**
 * Sends one SMS via ClickSend and logs the attempt to sms_logs regardless
 * of outcome. Never throws — a failed/misconfigured send shouldn't ever
 * break the checkout flow or the reminder cron; check `.sent` instead.
 */
export async function sendSms({
  profileId,
  mobile,
  templateName,
  message,
}: SendSmsParams): Promise<SendSmsResult> {
  const admin = createAdminClient();

  const normalized = normalizeAuMobile(mobile);
  if (!normalized) {
    console.error("[sms] unusable mobile number — skipping send", { profileId, templateName });
    await admin.from("sms_logs").insert({
      profile_id: profileId,
      template_name: templateName,
      message_body: message,
      delivery_status: "skipped_bad_number",
    });
    return { sent: false, status: "skipped_bad_number" };
  }

  const username = process.env.CLICKSEND_USERNAME;
  const apiKey = process.env.CLICKSEND_API_KEY;
  if (!username || !apiKey) {
    console.error("[sms] ClickSend credentials not configured — skipping send", {
      profileId,
      templateName,
    });
    await admin.from("sms_logs").insert({
      profile_id: profileId,
      template_name: templateName,
      message_body: message,
      delivery_status: "skipped_no_credentials",
    });
    return { sent: false, status: "skipped_no_credentials" };
  }

  let status: string;
  try {
    const auth = Buffer.from(`${username}:${apiKey}`).toString("base64");
    const res = await fetch(CLICKSEND_URL, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [{ source: "wcmt-rst-portal", body: message, to: normalized }],
      }),
    });
    const data: unknown = await res.json().catch(() => null);
    const messageStatus =
      data && typeof data === "object" && "data" in data
        ? // ClickSend's success shape: { data: { messages: [{ status }] } }
          ((data as { data?: { messages?: Array<{ status?: string }> } }).data?.messages?.[0]
            ?.status ?? null)
        : null;

    if (res.ok && messageStatus && messageStatus.toUpperCase() !== "FAILED") {
      status = "sent";
    } else {
      status = `error:${messageStatus ?? res.status}`;
      console.error("[sms] ClickSend send failed", { profileId, templateName, status, data });
    }
  } catch (err) {
    status = "error:network";
    console.error("[sms] ClickSend request threw", { profileId, templateName, err });
  }

  await admin.from("sms_logs").insert({
    profile_id: profileId,
    template_name: templateName,
    message_body: message,
    delivery_status: status,
  });

  return { sent: status === "sent", status };
}
