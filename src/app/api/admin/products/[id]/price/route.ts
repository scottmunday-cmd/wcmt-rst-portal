import { NextResponse, type NextRequest } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

/**
 * Admin-only price/description edit for a single product row. Wired up to
 * the "Edit" button on /admin/products, which — until now — had no
 * onClick at all and called nothing (found 15 September 2026: Scott
 * reported the Edit function "doesn't work at all", which was accurate —
 * it was never built).
 *
 * Deliberately just updates products.price_cents/description directly
 * rather than creating a new Stripe Price object: /api/checkout computes
 * the amount actually charged from products.price_cents at checkout time
 * (price_data.unit_amount — see that route's comments), so a DB-only
 * change is sufficient and takes effect immediately, the same way the
 * 0010_private_tuition_hourly_pricing.sql migration already changed a
 * price by hand. stripe_product_id (when set) is only used to group the
 * Checkout line item under an existing Stripe product for dashboard
 * cosmetics — it carries no price of its own that needs to stay in sync.
 *
 * Auth is checked here (not just relied on via RLS's products_admin_write
 * policy) so a bad request gets a clear 403 rather than a silent
 * zero-rows-updated from Postgres.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single<{ role: string }>();

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  let body: { price_cents?: unknown; description?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const update: { price_cents?: number; description?: string | null; updated_at: string } = {
    updated_at: new Date().toISOString(),
  };

  if (body.price_cents !== undefined) {
    const priceCents = Number(body.price_cents);
    if (!Number.isInteger(priceCents) || priceCents < 0) {
      return NextResponse.json(
        { error: "price_cents must be a non-negative whole number of cents" },
        { status: 400 }
      );
    }
    update.price_cents = priceCents;
  }

  if (body.description !== undefined) {
    if (body.description !== null && typeof body.description !== "string") {
      return NextResponse.json({ error: "description must be a string or null" }, { status: 400 });
    }
    update.description = body.description;
  }

  if (update.price_cents === undefined && update.description === undefined) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  // Admin client: RLS's products_admin_write policy would allow this
  // write from the authenticated user directly too, but the service-role
  // client keeps this route's own 403 check above as the single source of
  // truth rather than depending on RLS staying in sync with it.
  const admin = createAdminClient();
  const { data: updated, error } = await admin
    .from("products")
    .update(update)
    .eq("id", id)
    .select("id, name, slug, price_cents, description")
    .single();

  if (error || !updated) {
    console.error("[admin] product price update failed", { productId: id, error });
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }

  console.log("[admin] product price updated", {
    productId: id,
    by: user.id,
    price_cents: update.price_cents,
  });

  return NextResponse.json({ product: updated });
}
