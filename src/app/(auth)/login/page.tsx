"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Signs in via /api/auth/login (a server-side call) rather than the
    // browser Supabase client — see that route's comment for why: it fixes
    // a real bug where iPhone Safari (especially once installed to the
    // home screen) could loop straight back to this page after a correct
    // password, because the old client-side sign-in's cookie write could
    // lose a race against the immediate redirect.
    let res: Response;
    try {
      res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
    } catch {
      setLoading(false);
      setError("Couldn't reach the server — check your connection and try again.");
      return;
    }

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setLoading(false);
      setError(data.error ?? "Something went wrong logging in — please try again.");
      return;
    }

    // A plain client-side router.push("/dashboard") here would race
    // against AuthRefresher's own router.refresh() (same bug fixed in
    // LogoutButton.tsx on 12 September 2026) — a full page load can't
    // collide with that in-app refresh, since it discards the current
    // page (and any in-flight client navigation) entirely. The session
    // cookie is already reliably set by this point regardless, since it
    // arrived on /api/auth/login's own response.
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
