"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { Product } from "@/types/database";

/**
 * The product row on /admin/products, with a working "Edit" button.
 * Previously that button had no onClick at all — see the comment on
 * the API route this calls (src/app/api/admin/products/[id]/price/route.ts)
 * for the full history.
 *
 * Price is edited in dollars in this UI and converted to price_cents at
 * the API boundary, since that's the unit everyone (Scott included) thinks
 * in — price_cents only exists so Stripe amounts (which are cents) never
 * need a runtime conversion at checkout.
 */
export function EditableProductRow({ product }: { product: Product }) {
  const [current, setCurrent] = useState(product);
  const [editing, setEditing] = useState(false);
  const [priceInput, setPriceInput] = useState((current.price_cents / 100).toFixed(2));
  const [descriptionInput, setDescriptionInput] = useState(current.description ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function startEditing() {
    setPriceInput((current.price_cents / 100).toFixed(2));
    setDescriptionInput(current.description ?? "");
    setError(null);
    setEditing(true);
  }

  async function handleSave() {
    const dollars = Number(priceInput);
    if (!Number.isFinite(dollars) || dollars < 0) {
      setError("Enter a valid price, e.g. 150 or 150.00");
      return;
    }
    const price_cents = Math.round(dollars * 100);

    setSaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/products/${current.id}/price`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          price_cents,
          description: descriptionInput.trim() || null,
        }),
      });
      const body = await res.json();
      if (!res.ok) {
        throw new Error(body?.error ?? "Update failed");
      }
      setCurrent((prev) => ({ ...prev, ...body.product }));
      setEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-heading font-semibold text-wcmt-navy">{current.name}</p>
          <p className="text-sm text-slate-500">
            ${(current.price_cents / 100).toFixed(2)} · {current.active ? "Active" : "Inactive"}
          </p>
          {current.slug === "private-tuition" && (
            <p className="mt-1 text-xs text-amber-600">
              Note: the homepage&apos;s &quot;$150/hr&quot; headline for this product is
              hardcoded text, not derived from this price — saving a new hourly rate here
              updates the 3-hour-minimum caption automatically, but the headline itself
              still needs a code change.
            </p>
          )}
        </div>
        {!editing && (
          <Button variant="outline" onClick={startEditing}>
            Edit
          </Button>
        )}
      </div>

      {editing && (
        <div className="space-y-3 border-t border-slate-200 pt-3">
          <div>
            <label className="text-sm font-medium text-wcmt-navy" htmlFor={`price-${current.id}`}>
              Price (AUD)
            </label>
            <div className="mt-1 flex items-center gap-1">
              <span className="text-sm text-slate-500">$</span>
              <input
                id={`price-${current.id}`}
                type="number"
                step="0.01"
                min="0"
                value={priceInput}
                onChange={(e) => setPriceInput(e.target.value)}
                className="w-32 rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-wcmt-navy" htmlFor={`description-${current.id}`}>
              Description (shown on the homepage pricing card)
            </label>
            <textarea
              id={`description-${current.id}`}
              value={descriptionInput}
              onChange={(e) => setDescriptionInput(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </Button>
            <Button variant="outline" onClick={() => setEditing(false)} disabled={saving}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
