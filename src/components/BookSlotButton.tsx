"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

/**
 * Starts a Stripe Checkout for one specific assessment_slots row (a real
 * date, at a real location, with real capacity) — the slot-based sibling
 * of BuyButton.tsx's location dropdown. Used from the booking calendar at
 * /assessment. See src/app/api/checkout/route.ts for how the price is
 * (re)computed server-side and the seat is reserved the moment this call
 * succeeds.
 */
export function BookSlotButton({
  productSlug,
  slotId,
  className,
  disabled,
  children,
}: {
  productSlug: string;
  slotId: string;
  className?: string;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleBook() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productSlug, slotId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong starting checkout");
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong starting checkout");
      setLoading(false);
    }
  }

  return (
    <div>
      <Button onClick={handleBook} disabled={disabled || loading} className={className}>
        {loading ? "Redirecting…" : children}
      </Button>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
