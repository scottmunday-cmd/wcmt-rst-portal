"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

/**
 * Replaces the homepage hero's old "Request Callback" button, which
 * previously just linked to /faq and did nothing else (found 18 September
 * 2026). Clicking it now expands a small name/mobile form in place, which
 * posts to /api/callback-request — that route logs the lead and texts
 * Scott directly via ClickSend so he finds out right away.
 */
export function RequestCallbackForm() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage(null);

    try {
      const res = await fetch("/api/callback-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error ?? "Couldn't send that — please try again.");
      }
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Couldn't send that — please try again.");
    }
  }

  if (!open) {
    return (
      <Button
        type="button"
        variant="outline"
        className="border-white text-white hover:bg-white hover:text-wcmt-navy"
        onClick={() => setOpen(true)}
      >
        Request Callback
      </Button>
    );
  }

  if (status === "sent") {
    return (
      <p className="max-w-xs rounded-lg bg-white/10 px-4 py-3 text-sm text-white">
        Thanks{name ? `, ${name}` : ""} — we&apos;ve got your number and
        Scotty will give you a call back soon.
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-md flex-col gap-3 rounded-lg bg-white p-4 text-left shadow-lg sm:flex-row sm:items-end sm:flex-wrap"
    >
      <div className="flex-1 min-w-[8rem]">
        <label className="block text-xs font-medium text-slate-600" htmlFor="callback-name">
          Name
        </label>
        <input
          id="callback-name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900"
        />
      </div>
      <div className="flex-1 min-w-[8rem]">
        <label className="block text-xs font-medium text-slate-600" htmlFor="callback-phone">
          Mobile number
        </label>
        <input
          id="callback-phone"
          type="tel"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="04xx xxx xxx"
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900"
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={status === "sending"} className="whitespace-nowrap">
          {status === "sending" ? "Sending…" : "Send"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => setOpen(false)}
          className="whitespace-nowrap"
        >
          Cancel
        </Button>
      </div>
      {status === "error" && errorMessage && (
        <p className="w-full text-xs text-red-600">{errorMessage}</p>
      )}
    </form>
  );
}
