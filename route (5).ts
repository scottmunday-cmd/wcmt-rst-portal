import { NextResponse, type NextRequest } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import type { AssessmentLocation, Product } from "@/types/database";

/**
 * Starts a Stripe Checkout for one product, optionally priced for a
 * specific assessment location (see 0005_location_travel_surcharge.sql
 * and the "Location travel surcharge" section of the Technical Build
 * Pack). The client never sends a price — only a product slug and,
 * for location-priced products, a location id — and this route computes
 * the actual amount server-side so nothing about pricing is trust-the-
 * browser.
 *
 * Body: { productSlug: string; locationId?: string }
 */
export async function POST(request: NextRequest) {
  let body: { productSlug?: string; locationId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { productSlug, locationId } = body;
  if (!productSlug) {
    return NextResponse.json({ error: "productSlug is required" }, { status: 400 });
  }

  // Auth: must be logged in — an order always belongs to a profile.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  // Reads below use the admin client. products/assessment_locations are
  // readable by any authenticated user under RLS (see 0002), but
  // `settings` is admin-only — and orders has no insert policy for
  // authenticated at all (see 0002's comment on payments). Order creation
  // is deliberately server-only: this route, not the client, decides the
  // price and writes the row.
  const admin = createAdminClient();

  const { data: product, error: productError } = await admin
    .from("products")
    .select("*")
    .eq("slug", productSlug)
    .eq("active", true)
    .single<Product>();

  if (productError || !product) {
    return NextResponse.json({ error: "Unknown or inactive product" }, { status: 404 });
  }

  let amountCents = product.price_cents;
  let location: AssessmentLocation | null = null;

  if (product.requires_location) {
    if (!locationId) {
      return NextResponse.json(
        { error: "This product requires a location to be selected" },
        { status: 400 }
      );
    }

    const { data: locationRow, error: locationError } = await admin
      .from("assessment_locations")
      .select("*")
      .eq("id", locationId)
      .eq("active", true)
      .single<AssessmentLocation>();

    if (locationError || !locationRow) {
      return NextResponse.json({ error: "Unknown or inactive location" }, { status: 404 });
    }
    location = locationRow;

    const { data: setting } = await admin
      .from("settings")
      .select("setting_value")
      .eq("setting_key", "travel_surcharge_unit_cents")
      .single();
    const unitCents = Number(setting?.setting_value ?? 5000);

    amountCents += location.travel_surcharge_multiplier * unitCents;
  }

  // Create the order first (status "pending") so we have an id to attach
  // to the Checkout Session before redirecting — the webhook flips this
  // to "paid" on checkout.session.completed.
  const { data: order, error: orderError } = await admin
    .from("orders")
    .insert({
      profile_id: user.id,
      product_id: product.id,
      amount_cents: amountCents,
      status: "pending",
      assessment_location_id: location?.id ?? null,
    })
    .select("id")
    .single();

  if (orderError || !order) {
    return NextResponse.json({ error: "Could not start order" }, { status: 500 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const productName = location ? `${product.name} — ${location.name}` : product.name;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: user.email ?? undefined,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "aud",
          unit_amount: amountCents,
          // Prefer the catalog product in Stripe (set once the admin
          // pastes stripe_product_id in) so this still shows up under the
          // same product in the Stripe dashboard; fall back to an inline
          // name if that hasn't been wired up yet.
          ...(product.stripe_product_id
            ? { product: product.stripe_product_id }
            : { product_data: { name: productName } }),
        },
      },
    ],
    success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/checkout/cancel`,
    metadata: { order_id: order.id },
  });

  await admin.from("orders").update({ stripe_session_id: session.id }).eq("id", order.id);

  return NextResponse.json({ url: session.url });
}
