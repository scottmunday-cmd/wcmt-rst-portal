"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

// Preview tool for the admin-only "Test SMS" page — posts to
// /api/admin/test-sms, which renders the chosen template (reading the
// live row from sms_templates, same as a real send) and sends it via the
// existing sendSms()/ClickSend path. Added 22 October 2026 so Scott can
// see exactly what a template looks like on a real phone — wrapping,
// link preview, segment count — any time he reworks one, without needing
// Claude (or anyone) to handle the ClickSend credentials directly.
const TEMPLATES = [
  { value: "assessment_reminder_48h", label: "Assessment reminder (48h)" },
  { value: "booking_confirmation", label: "Booking confirmation" },
];

// Sample values covering every {{placeholder}} either template above
// uses — any field a template doesn't reference is simply ignored by
// fillTemplate(). Edit these here if you add a template with new
// placeholders.
const DEFAULT_VARS: Record<string, string> = {
  first_name: "Tim",
  date: "24 Oct",
  time: "9:00am",
  location: "Two Rocks",
  product_name: "RST Assessment",
  details: "See you then!",
};

export function TestSmsForm() {
  const [mobile, setMobile] = useState("");
  const [templateName, setTemplateName] = useState(TEMPLATES[0].value);
  const [vars, setVars] = useState(DEFAULT_VARS);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage(null);
    setResultMessage(null);

    try {
      const res = await fetch("/api/admin/test-sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, templateName, vars }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.sent) {
        throw new Error(data.error ?? `Send failed (${data.status ?? "unknown error"})`);
      }
      setStatus("sent");
      setResultMessage(data.message);
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Couldn't send that — please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium text-wcmt-navy" htmlFor="test-sms-mobile">
          Mobile number
        </label>
        <input
          id="test-sms-mobile"
          type="tel"
          required
          placeholder="04XX XXX XXX"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          className="mt-1 w-full max-w-xs rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-wcmt-navy" htmlFor="test-sms-template">
          Template
        </label>
        <select
          id="test-sms-template"
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
          className="mt-1 w-full max-w-xs rounded-md border border-slate-300 px-3 py-2 text-sm"
        >
          {TEMPLATES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {Object.keys(DEFAULT_VARS).map((key) => (
          <div key={key}>
            <label className="text-xs font-medium text-slate-500" htmlFor={`test-sms-var-${key}`}>
              {`{{${key}}}`}
            </label>
            <input
              id={`test-sms-var-${key}`}
              type="text"
              value={vars[key] ?? ""}
              onChange={(e) => setVars((v) => ({ ...v, [key]: e.target.value }))}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
        ))}
      </div>

      <Button type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Send Test"}
      </Button>

      {status === "sent" && (
        <div className="rounded-md bg-wcmt-bg p-3 text-sm">
          <p className="font-medium text-wcmt-navy">Sent! Message body:</p>
          <p className="mt-1 whitespace-pre-wrap text-slate-600">{resultMessage}</p>
        </div>
      )}
      {status === "error" && errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
    </form>
  );
}
