import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Server-side password update — same 18 September 2026 fix as
 * /api/auth/login and /api/auth/register, applied here too for
 * consistency. The race window here is smaller (the recovery session
 * cookie was already written by the browser client's detectSessionInUrl
 * when this page first loaded, well before the user gets around to
 * submitting this form), but it's the same client-cookie-write-then-navigate
 * shape, so it gets the same fix rather than leaving one copy of the
 * pattern in place. The server client below reads the recovery session
 * straight off this request's existing cookies, and updateUser() runs
 * here so any session refresh goes out as a real Set-Cookie header on
 * this response — the confirmation redirect that follows doesn't depend
 * on any client-side cookie write landing in time.
 */
export async function POST(request: NextRequest) {
  let body: { password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { password } = body;
  if (!password || password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters." },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
