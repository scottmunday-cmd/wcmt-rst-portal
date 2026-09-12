"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { clsx } from "clsx";

// There was previously no way to log out anywhere in the app — once
// signed in, the only way to "switch accounts" was to type URLs and
// hope the session cookie behaved. That's exactly what made testing
// with a second account so confusing (see the Technical Build Pack /
// chat history around 11 September 2026).
//
// Found 12 September 2026: clicking this appeared to do nothing — you'd
// stay on the same page looking still logged in. What was actually
// happening: signOut() fires the SIGNED_OUT auth event, which
// AuthRefresher (src/components/AuthRefresher.tsx) *also* reacts to with
// its own router.refresh(). That refresh could land on the current
// (student/instructor/admin) layout at the same moment this button's own
// router.push("/") + router.refresh() were running, and the layout's own
// `redirect("/login")` (it re-checks auth on every render) would fire
// mid-navigation. Two client-side navigations racing on the same page
// left the router in a state where nothing visibly changed — the session
// was actually gone underneath, but you'd only discover that on your next
// manual refresh or link click. A full page load sidesteps the race
// entirely: it can't collide with a client-side refresh because it
// throws away the current page (and any in-flight client navigation)
// and asks the server fresh, which now correctly has no session.
export function LogoutButton({ className }: { className?: string }) {
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    if (loggingOut) return;
    setLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loggingOut}
      className={clsx(
        "text-sm font-medium hover:underline disabled:opacity-60",
        className
      )}
    >
      {loggingOut ? "Logging out…" : "Log Out"}
    </button>
  );
}
