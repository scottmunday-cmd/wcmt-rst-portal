import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Server-side sign-up — same fix, same day, same reason as
 * /api/auth/login (see that route's comment for the full explanation).
 * (auth)/register/page.tsx only hit this particular race when "Confirm
 * email" is off in Supabase Auth (a signUp() call that returns a session
 * immediately, rather than requiring the confirmation link first) — but
 * it's the exact same client-side write-then-navigate pattern, so it gets
 * the exact same fix rather than leaving a second, rarer copy of the same
 * bug in place.
 *
 * The `profiles` row itself is created by a database trigger on
 * auth.users insert (not here) — this just passes the extra fields along
 * as user metadata for that trigger to read, same as before.
 */
export async function POST(request: NextRequest) {
  let body: {
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    mobile?: string | null;
    smsConsent?: boolean;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { email, password, firstName, lastName, mobile, smsConsent } = body;
  if (!email || !password || !firstName || !lastName) {
    return NextResponse.json({ error: "Please fill in all required fields" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
        mobile: mobile?.trim() || null,
        sms_consent: Boolean(smsConsent),
      },
    },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // No session yet means "Confirm email" is on and signUp() is waiting on
  // the confirmation link — see the comment in register/page.tsx for why
  // that's handled as its own state rather than treated like a normal
  // successful sign-up.
  return NextResponse.json({ ok: true, needsEmailConfirmation: !data.session });
}
