"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";

/**
 * Lets a logged-in student add/update their own mobile number and SMS
 * consent — added alongside the SMS reminders feature, since students who
 * registered before the register form collected a mobile number (i.e.
 * everyone, until this shipped) would otherwise have no way to opt in.
 * Writes straight to `profiles` via the browser client — the
 * "profiles_self_update" RLS policy (0002_rls_policies.sql) already
 * allows a user to update their own row, no API route needed.
 */
export function ProfileSettingsForm({
  initialMobile,
  initialSmsConsent,
}: {
  initialMobile: string | null;
  initialSmsConsent: boolean;
}) {
  const supabase = createClient();
  const [mobile, setMobile] = useState(initialMobile ?? "");
  const [smsConsent, setSmsConsent] = useState(initialSmsConsent);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setStatus("idle");
    setErrorMessage(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setSaving(false);
      setStatus("error");
      setErrorMessage("You've been signed out — please log in again.");
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        mobile: mobile.trim() || null,
        sms_consent: smsConsent,
        consent_recorded_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    setSaving(false);
    if (error) {
      setStatus("error");
      setErrorMessage(error.message);
    } else {
      setStatus("saved");
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-4">
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
      </div>
      <label className="flex items-start gap-2 text-xs text-slate-600">
        <input
          type="checkbox"
          checked={smsConsent}
          onChange={(e) => setSmsConsent(e.target.checked)}
          className="mt-0.5"
        />
        I agree to receive SMS booking confirmations and assessment reminders.
      </label>
      {status === "saved" && <p className="text-sm text-wcmt-green">Saved.</p>}
      {status === "error" && (
        <p className="text-sm text-red-600">{errorMessage ?? "Something went wrong — try again."}</p>
      )}
      <Button type="submit" disabled={saving}>
        {saving ? "Saving…" : "Save"}
      </Button>
    </form>
  );
}
