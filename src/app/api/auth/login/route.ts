import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Server-side login — added 18 September 2026 after reports of iPhone
 * Safari looping straight back to the login screen after a correct
 * password (no error shown, just landing back on /login every time).
 *
 * (auth)/login/page.tsx previously called
 * supabase.auth.signInWithPassword() directly from the browser client
 * (@supabase/ssr's createBrowserClient), which writes the session as a
 * cookie via document.cookie, then did a full window.location.href
 * navigation to /dashboard straight after. Write-then-navigate like that
 * is a client-side race even in the best case, and Safari — particularly
 * iOS Safari, and especially once the site is added to the home screen as
 * a standalone app (see src/app/manifest.ts) — has long-documented
 * reliability issues persisting a document.cookie write before the very
 * next navigation's request goes out. If that request reaches
 * middleware.ts before the cookie actually landed, there's no session yet,
 * so (student)/layout.tsx redirects straight back to /login — indistinguishable
 * from a wrong password, except the password was right.
 *
 * Doing the sign-in here instead means the session cookie goes out as a
 * real Set-Cookie response header on this fetch. Every browser, Safari
 * included, guarantees a Set-Cookie header is applied before the page's JS
 * gets to act on that response, so there's no window left for the race
 * that was causing this.
 */
export async function POST(request: NextRequest) {
  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { email, password } = body;
  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
