import { NextResponse, type NextRequest } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import type { AssessmentLocation, AssessmentSlot, Product } from "@/types/database";

/**
 * Starts a Stripe Checkout for one product. The client never sends a
 * price — this route always computes the actual amount server-side —
 * and for anything location- or slot-based it never sends the *identity*
 * of what it's paying for either beyond an id to look up, so nothing
 * about pricing or availability is trust-the-browser.
 *
 * Two independent pricing/availability modes, both from
 * 0005_location_travel_surcharge.sql / 0009_assessment_slot_booking.sql:
 *   - requires_slot (currently just the in-person assessment): the
 *     student picked a specific assessment_slots row (a real date, at a
 *     real location, with real capacity) from the booking calendar at
 *     /assessment. Body carries `slotId`. This reserves the seat — by
 *     inserting into assessment_bookings — the moment checkout starts,
 *     not when payment completes, because fn_book_assessment_slot()'s
 *     capacity check has to happen before we know payment will succeed:
 *     doing it only in the webhook risks taking someone's money for a
 *     seat that's already gone. See the cancel page and the webhook's
 *     checkout.session.expired handler for how an abandoned/cancelled
 *     checkout releases that seat again.
 *   - requires_location (private tuition): the older flow — any active
 *     location, no date/capacity concept, priced by travel surcharge
 *     only. Body carries `locationId`.
 *
 * Body: { productSlug: string; slotId?: string; locationId?: string }
 */
export async function POST(request: NextRequest) {
  let body: { productSlug?: string; slotId?: string; locationId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { productSlug, slotId, locationId } = body;
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
  let slot: AssessmentSlot | null = null;

  if (product.requires_slot) {
    if (!slotId) {
      return NextResponse.json(
        { error: "This product requires a date to be selected" },
        { status: 400 }
      );
    }

    const { data: slotRow, error: slotError } = await admin
      .from("assessment_slots")
      .select("*")
      .eq("id", slotId)
      .eq("active", true)
      .single<AssessmentSlot>();

    if (slotError || !slotRow) {
      return NextResponse.json({ error: "That date is no longer available" }, { status: 404 });
    }
    if (slotRow.booked_count >= slotRow.capacity) {
      return NextResponse.json({ error: "That date just filled up — please pick another" }, { status: 409 });
    }
    slot = slotRow;

    const { data: locationRow, error: locationError } = await admin
      .from("assessment_locations")
      .select("*")
      .eq("id", slot.location_id)
      .single<AssessmentLocation>();

    if (locationError || !locationRow) {
      return NextResponse.json({ error: "Unknown location for that date" }, { status: 404 });
    }
    location = locationRow;

    const { data: setting } = await admin
      .from("settings")
      .select("setting_value")
      .eq("setting_key", "travel_surcharge_unit_cents")
      .single();
    const unitCents = Number(setting?.setting_value ?? 5000);

    amountCents += location.travel_surcharge_multiplier * unitCents;
  } else if (product.requires_location) {
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
      assessment_slot_id: slot?.id ?? null,
    })
    .select("id")
    .single();

  if (orderError || !order) {
    return NextResponse.json({ error: "Could not start order" }, { status: 500 });
  }

  if (slot) {
    // Reserve the seat now, not when payment completes — see the module
    // comment above for why. fn_book_assessment_slot() (0001_core_schema.sql)
    // re-checks capacity atomically here and raises if the slot filled up
    // between our read above and this insert (two students racing for the
    // last spot); if that happens, cancel the order we just created rather
    // than send someone to Stripe to pay for a seat that no longer exists.
    const { data: studentRow } = await admin
      .from("students")
      .select("id")
      .eq("profile_id", user.id)
      .single<{ id: string }>();

    const { error: bookingError } = await admin.from("assessment_bookings").insert({
      student_id: studentRow?.id,
      slot_id: slot.id,
      order_id: order.id,
      status: "booked",
    });

    if (bookingError) {
      await admin.from("orders").update({ status: "cancelled" }).eq("id", order.id);
      return NextResponse.json(
        { error: "That date just filled up — please pick another" },
        { status: 409 }
      );
    }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const productName = slot
    ? `${product.name} — ${location?.name} — ${slot.assessment_date}`
    : location
      ? `${product.name} — ${location.name}`
      : product.name;

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
    // Carries session_id too (not just success_url) so the cancel page can
    // look up this specific order and, if it reserved a slot, release that
    // seat straight away instead of leaving it held until the 24h Stripe
    // Checkout Session expiry does it (see checkout/cancel/page.tsx).
    cancel_url: `${siteUrl}/checkout/cancel?session_id={CHECKOUT_SESSION_ID}`,
    metadata: { order_id: order.id },
  });

  await admin.from("orders").update({ stripe_session_id: session.id }).eq("id", order.id);

  return NextResponse.json({ url: session.url });
}
