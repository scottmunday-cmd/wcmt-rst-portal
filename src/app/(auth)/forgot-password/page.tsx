"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

// Previously there was no self-service way to reset a forgotten password at
// all — no link on the login page, and no page to land on even if one had
// been sent manually from the Supabase dashboard. This page requests the
// reset email; src/app/(auth)/reset-password/page.tsx is where the emailed
// link actually lands to let the user set a new password.
export default function ForgotPasswordPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    // Deliberately shown regardless of whether the email exists — this is
    // the standard pattern to avoid leaking which addresses are registered.
    setSent(true);
  }

  if (sent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-wcmt-bg px-6">
        <Card className="w-full max-w-sm text-center">
          <h1 className="font-heading text-xl font-bold text-wcmt-navy">Check your email</h1>
          <p className="mt-3 text-sm text-slate-600">
            If an account exists for <strong>{email}</strong>, we&apos;ve sent a link to reset
            your password. It can take a minute or two to arrive — check spam too.
          </p>
          <Link href="/login" className="mt-6 inline-block text-sm font-medium text-wcmt-orange">
            Back to Log In
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-wcmt-bg px-6">
      <Card className="w-full max-w-sm">
        <h1 className="font-heading text-xl font-bold text-wcmt-navy">Reset your password</h1>
        <p className="mt-2 text-sm text-slate-600">
          Enter the email on your account and we&apos;ll send you a link to set a new password.
        </p>
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
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Sending…" : "Send reset link"}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-500">
          <Link href="/login" className="font-medium text-wcmt-orange">
            Back to Log In
          </Link>
        </p>
      </Card>
    </div>
  );
}
