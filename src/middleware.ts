import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Keeps the Supabase auth session cookie fresh on every request, and is the
// place to add role-based route protection (e.g. redirect a non-admin away
// from /admin) once the `profiles` table is queried here.
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refreshes the session if it's expired. Required for Server Components,
  // which can't set cookies themselves.
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    // Excludes /api/stripe/webhook: Stripe's signature check needs the exact
    // raw request body, and this route does its own auth (webhook secret) —
    // it doesn't need (and shouldn't risk any interference from) the cookie
    // refresh middleware does for browser-facing pages.
    "/((?!_next/static|_next/image|favicon.ico|api/stripe/webhook|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
