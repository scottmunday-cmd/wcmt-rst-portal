"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [smsConsent, setSmsConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Signs up via /api/auth/register (a server-side call) rather than the
    // browser Supabase client — same 18 September 2026 fix as
    // login/page.tsx, and for the same reason: see that route's (and
    // /api/auth/login's) comment. The `profiles` row itself is created by
    // a database trigger on auth.users insert (not here) — this just
    // passes the extra fields along as user metadata for that trigger to
    // read, same as before.
    let res: Response;
    try {
      res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          firstName,
          lastName,
          mobile: mobile.trim() || null,
          smsConsent,
        }),
      });
    } catch {
      setLoading(false);
      setError("Couldn't reach the server — check your connection and try again.");
      return;
    }

    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Something went wrong creating your account — please try again.");
      return;
    }

    // If the Supabase project has "Confirm email" turned on (the default
    // for a new project), signUp() succeeds but returns no session until
    // the person clicks the confirmation link in their email. Redirecting
    // to /dashboard in that state just bounces them straight to /login
    // looking logged-out, which is confusing right after "successfully"
    // creating an account.
    if (data.needsEmailConfirmation) {
      setCheckEmail(true);
      return;
    }

    // See the comment on the equivalent line in login/page.tsx — a full
    // page load here (not a client-side router.push/refresh) avoids
    // racing AuthRefresher's own router.refresh() on the same SIGNED_IN
    // event, and the session cookie is already reliably set by this
    // point since it arrived on /api/auth/register's own response.
    window.location.href = "/dashboard";
  }

  if (checkEmail) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-wcmt-bg px-6 py-12">
        <Card className="w-full max-w-sm text-center">
          <h1 className="font-heading text-xl font-bold text-wcmt-navy">Almost there</h1>
          <p className="mt-3 text-sm text-slate-600">
            We&apos;ve sent a confirmation link to <strong>{email}</strong>. Click
            it to activate your account, then come back and log in.
          </p>
          <p className="mt-4 text-center text-sm text-slate-500">
            <Link href="/login" className="font-medium text-wcmt-orange">
              Go to Log In
            </Link>
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-wcmt-bg px-6 py-12">
      <Card className="w-full max-w-sm">
        <h1 className="font-heading text-xl font-bold text-wcmt-navy">Create Your Account</h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-wcmt-navy" htmlFor="firstName">
                First name
              </label>
              <input
                id="firstName"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-wcmt-navy" htmlFor="lastName">
                Last name
              </label>
              <input
                id="lastName"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
          </div>
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
            <label className="text-sm font-medium text-wcmt-navy" htmlFor="mobile">
              Mobile number
            </label>
            <input
              id="mobile"
              type="tel"
              inputMode="tel"
              placeholder="04XX XXX XXX"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
            <p className="mt-1 text-xs text-slate-500">
              Optional — only used for booking confirmations and assessment reminders if you opt in below.
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-wcmt-navy" htmlFor="password">
              Password
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
          <label className="flex items-start gap-2 text-xs text-slate-600">
            <input
              type="checkbox"
              checked={smsConsent}
              onChange={(e) => setSmsConsent(e.target.checked)}
              className="mt-0.5"
            />
            I agree to receive SMS reminders about my bookings and assessments.
          </label>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Creating account…" : "Create Account"}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-wcmt-orange">
            Log in
          </Link>
        </p>
      </Card>
    </div>
  );
}
