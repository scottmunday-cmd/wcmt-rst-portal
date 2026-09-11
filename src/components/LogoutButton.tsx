"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { clsx } from "clsx";

// There was previously no way to log out anywhere in the app — once
// signed in, the only way to "switch accounts" was to type URLs and
// hope the session cookie behaved. That's exactly what made testing
// with a second account so confusing (see the Technical Build Pack /
// chat history around 11 September 2026).
export function LogoutButton({ className }: { className?: string }) {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    // AuthRefresher (src/components/AuthRefresher.tsx) also reacts to the
    // SIGNED_OUT event, but pushing + refreshing here means it happens
    // immediately rather than waiting on that listener.
    router.push("/");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className={clsx("text-sm font-medium hover:underline", className)}
    >
      Log Out
    </button>
  );
}
