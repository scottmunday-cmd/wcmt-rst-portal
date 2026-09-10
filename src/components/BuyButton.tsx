"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export interface BuyButtonLocation {
  id: string;
  name: string;
  /** Final price for this product at this location, in cents (base + travel surcharge). */
  priceCents: number;
}

/**
 * Starts a Stripe Checkout for one product via /api/checkout. For a
 * product that requires a location (see Product.requires_location), shows
 * a location picker first so the student sees the real, location-adjusted
 * price before paying — the server recomputes and enforces that price
 * regardless of what's sent here (see the checkout route's comments).
 */
export function BuyButton({
  productSlug,
  locations,
}: {
  productSlug: string;
  locations?: BuyButtonLocation[];
}) {
  const requiresLocation = Boolean(locations && locations.length > 0);
  const [locationId, setLocationId] = useState(locations?.[0]?.id ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleBuy() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productSlug,
          ...(requiresLocation ? { locationId } : {}),
        }),
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
    <div className="space-y-2">
      {requiresLocation && (
        <select
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          value={locationId}
          onChange={(e) => setLocationId(e.target.value)}
        >
          {locations!.map((loc) => (
            <option key={loc.id} value={loc.id}>
              {loc.name} — ${(loc.priceCents / 100).toFixed(2)}
            </option>
          ))}
        </select>
      )}
      <Button onClick={handleBuy} disabled={loading} className="w-full">
        {loading ? "Redirecting…" : "Buy Now"}
      </Button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
