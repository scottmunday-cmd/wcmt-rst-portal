"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

// Where the emailed reset link (from forgot-password) lands. Supabase's
// browser client reads the recovery tokens out of the URL hash on load and
// fires a PASSWORD_RECOVERY auth event once that session is established —
// we wait for that instead of assuming a session exists immediately on
// mount, since detectSessionInUrl runs asynchronously.
export default function ResetPasswordPage() {
  const supabase = createClient();
  const [ready, setReady] = useState(false);
  const [invalidLink, setInvalidLink] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
      }
    });

    // Covers the case where the recovery session was already established
    // (e.g. the PASSWORD_RECOVERY event fired before this listener was
    // attached) — if there's a session at all when this page loads via a
    // reset link, treat it as ready rather than waiting indefinitely.
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true);
    });

    // Flips the "expired" screen on after a few seconds with no recovery
    // session — but the render below only shows it while `ready` is still
    // false, so this is a no-op once PASSWORD_RECOVERY has already fired.
    const timeout = setTimeout(() => setInvalidLink(true), 4000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }
    setDone(true);
    // Same full-page-load fix applied to login/register/logout on 12
    // September 2026: a client-side router.push/refresh here isn't known
    // to race with AuthRefresher (updateUser fires USER_UPDATED, which it
    // doesn't listen for), but there's no reason to keep the one
    // navigation style in this file that's proven unreliable elsewhere.
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 1500);
  }

  if (done) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-wcmt-bg px-6">
        <Card className="w-full max-w-sm text-center">
          <h1 className="font-heading text-xl font-bold text-wcmt-navy">Password updated</h1>
          <p className="mt-3 text-sm text-slate-600">Taking you to your dashboard…</p>
        </Card>
      </div>
    );
  }

  if (invalidLink && !ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-wcmt-bg px-6">
        <Card className="w-full max-w-sm text-center">
          <h1 className="font-heading text-xl font-bold text-wcmt-navy">
            This link has expired
          </h1>
          <p className="mt-3 text-sm text-slate-600">
            Password reset links only work once and expire after a while. Request a new one to
            continue.
          </p>
          <a
            href="/forgot-password"
            className="mt-6 inline-block text-sm font-medium text-wcmt-orange"
          >
            Send a new reset link
          </a>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-wcmt-bg px-6">
      <Card className="w-full max-w-sm">
        <h1 className="font-heading text-xl font-bold text-wcmt-navy">Set a new password</h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-wcmt-navy" htmlFor="password">
              New password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-wcmt-navy" htmlFor="confirmPassword">
              Confirm new password
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" disabled={loading || !ready} className="w-full">
            {!ready ? "Verifying link…" : loading ? "Saving…" : "Set new password"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
