import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { renderSmsTemplate, sendSms } from "@/lib/sms";

// Admin-only "send a test SMS" endpoint — added 22 October 2026 so Scott
// can preview exactly what a template will look like on a real phone
// (character wrapping, link preview, segment count) before students see
// it, without anyone (including Claude) ever needing the ClickSend
// credentials directly: this route runs server-side on Vercel, where
// CLICKSEND_USERNAME/CLICKSEND_API_KEY already live as env vars, and
// reuses the exact same renderSmsTemplate()/sendSms() path the real
// booking-confirmation and assessment-reminder sends use — so a test
// send is a true preview, not a re-implementation that could drift from
// the real thing. profileId is null (see sendSms' comment on that field)
// since a test send has no associated student.
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userData.user.id)
    .single<{ role: string }>();

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const mobile = typeof body?.mobile === "string" ? body.mobile : null;
  const templateName = typeof body?.templateName === "string" ? body.templateName : null;
  const vars = body?.vars && typeof body.vars === "object" ? (body.vars as Record<string, string>) : {};

  if (!mobile || !templateName) {
    return NextResponse.json({ error: "mobile and templateName are required" }, { status: 400 });
  }

  let message: string;
  try {
    message = await renderSmsTemplate(templateName, vars);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Couldn't render template" },
      { status: 400 }
    );
  }

  const result = await sendSms({ profileId: null, mobile, templateName, message });

  return NextResponse.json({ ...result, message });
}
