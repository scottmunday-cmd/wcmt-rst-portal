"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setLoading(false);
      setError(error.message);
      return;
    }
    // A plain client-side router.push("/dashboard") here raced against
    // AuthRefresher's own router.refresh() (both react to the SIGNED_IN
    // event this signInWithPassword() call fires) — same bug fixed in
    // LogoutButton.tsx on 12 September 2026: the two navigations could
    // collide and leave you stuck looking at the login page with no
    // error, even though you were actually signed in underneath. A full
    // page load can't collide with that in-app refresh, since it discards
    // the current page (and any in-flight client navigation) entirely.
    window.location.href = "/dashboard";
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-wcmt-bg px-6">
      <Card className="w-full max-w-sm">
        <h1 className="font-heading text-xl font-bold text-wcmt-navy">Log In</h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-wcmt-navy" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-wcmt-navy" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Logging in…" : "Log In"}
          </Button>
        </form>
        <p className="mt-3 text-center text-sm">
          <Link href="/forgot-password" className="font-medium text-wcmt-orange">
            Forgot your password?
          </Link>
        </p>
        <p className="mt-4 text-center text-sm text-slate-500">
          New here?{" "}
          <Link href="/register" className="font-medium text-wcmt-orange">
            Create an account
          </Link>
        </p>
      </Card>
    </div>
  );
}
