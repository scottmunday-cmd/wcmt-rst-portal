"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

/**
 * Mounted once in the root layout. Fixes a real bug found during
 * Scott's first live signup: Supabase's email-confirmation link
 * redirects back to the site with the new session encoded in the URL
 * (a hash fragment, for the implicit flow this project uses). The
 * browser Supabase client picks that up and updates its own in-memory
 * session automatically, but our actual pages are Server Components
 * that read the session from cookies — so the *first* server render
 * after landing from that link still sees "logged out" until
 * something tells Next.js to re-render with the now-current cookies.
 * Before this fix, the only way to see that was to manually refresh.
 *
 * onAuthStateChange fires whenever the browser client's session
 * changes for any reason (confirmation-link landing, sign-in, sign-out,
 * token refresh) — router.refresh() on those events re-runs Server
 * Components against the current session without a manual reload.
 */
export function AuthRefresher() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    let skipFirst = true;

    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      // The first callback just reports whatever session already existed
      // when this component mounted — nothing actually changed, so
      // refreshing here would just be wasted work on every page load.
      if (skipFirst) {
        skipFirst = false;
        return;
      }
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "TOKEN_REFRESHED") {
        router.refresh();
      }
    });

    return () => listener.subscription.unsubscribe();
  }, [router]);

  return null;
}
