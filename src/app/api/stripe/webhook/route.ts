import { NextResponse, type NextRequest } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/server";
import { sendSms, renderSmsTemplate } from "@/lib/sms";

// This is the safety net, not the primary path — see the "Stripe
// integration" section of the Technical Build Pack. The Admin Portal
// drives price changes directly; this handler fulfils paid orders and
// reconciles Supabase if a price/product is ever edited straight in the
// Stripe dashboard.
export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    // Logged deliberately: a signature failure previously only showed up as
    // a 400 in Stripe's dashboard, with no detail on Vercel's side about
    // *why* verification failed (wrong secret vs. a mangled/truncated body).
    console.error("[stripe webhook] signature verification failed", {
      message,
      bodyLength: body.length,
      hasSignatureHeader: Boolean(signature),
    });
    return NextResponse.json({ error: `Webhook signature verification failed: ${message}` }, { status: 400 });
  }

  const supabase = createAdminClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      // Idempotency: Stripe can deliver the same event more than once, and
      // this update is a no-op the second time since it targets a specific
      // session id rather than inserting a new row.
      //
      // Logged deliberately: Stripe only cares that this route returns a
      // 2xx response, so a failed or no-op update here was previously
      // invisible — the dashboard showed "200 OK / Delivered" even though
      // nothing in Supabase changed. .select("id") after the update tells
      // us how many rows actually matched, and any Postgres/RLS error is
      // logged instead of silently swallowed.
      const { data: updatedRows, error: updateError } = await supabase
        .from("orders")
        .update({ status: "paid" })
        .eq("stripe_session_id", session.id)
        .select("id, profile_id, product_id, assessment_slot_id");

      if (updateError) {
        console.error("[stripe webhook] failed to mark order paid", {
          sessionId: session.id,
          error: updateError,
        });
      } else {
        console.log("[stripe webhook] checkout.session.completed processed", {
          sessionId: session.id,
          matchedOrders: updatedRows?.length ?? 0,
        });
      }

      // Booking confirmation SMS (to the student) + new-booking alert (to
      // Scott). Best-effort and never lets a send problem affect the 200
      // OK Stripe needs — sendSms() itself never throws, but the lookups
      // around it are wrapped too. Runs once per order (the .update()
      // above only matches a still-pending order by stripe_session_id, so
      // a retried webhook delivery for an already-paid order matches zero
      // rows and skips this entirely).
      const order = updatedRows?.[0];
      if (order) {
        try {
          const { data: profile } = await supabase
            .from("profiles")
            .select("first_name, last_name, mobile, sms_consent")
            .eq("id", order.profile_id)
            .single<{
              first_name: string | null;
              last_name: string | null;
              mobile: string | null;
              sms_consent: boolean;
            }>();

          const { data: product } = await supabase
            .from("products")
            .select("name")
            .eq("id", order.product_id)
            .single<{ name: string }>();

          let details = "";
          if (order.assessment_slot_id) {
            const { data: slot } = await supabase
              .from("assessment_slots")
              .select("assessment_date, assessment_time, location_id")
              .eq("id", order.assessment_slot_id)
              .single<{ assessment_date: string; assessment_time: string; location_id: string }>();

            if (slot) {
              const { data: location } = await supabase
                .from("assessment_locations")
                .select("name")
                .eq("id", slot.location_id)
                .single<{ name: string }>();

              details = `You're booked for ${slot.assessment_date} at ${slot.assessment_time}${
                location ? `, ${location.name}` : ""
              }. We'll text a reminder closer to the day.`;
            }
          }

          // The student's own confirmation — gated on their sms_consent,
          // same as always, since this lands on a customer's phone.
          if (profile?.sms_consent && profile.mobile) {
            const message = await renderSmsTemplate("booking_confirmation", {
              first_name: profile.first_name ?? "there",
              product_name: product?.name ?? "your course",
              details,
            });

            await sendSms({
              profileId: order.profile_id,
              mobile: profile.mobile,
              templateName: "booking_confirmation",
              message,
            });
          }

          // Scott's own new-booking alert — added 19 September 2026 so he
          // doesn't have to keep checking the Bookings page to notice a
          // new sign-up. Deliberately independent of the student's
          // sms_consent above: that consent covers texts TO the student,
          // not whether the business owner hears about a sale. Silently
          // skipped (same as /api/callback-request) if OWNER_MOBILE_NUMBER
          // isn't configured.
          const ownerMobile = process.env.OWNER_MOBILE_NUMBER;
          if (ownerMobile) {
            const studentName =
              `${profile?.first_name ?? ""} ${profile?.last_name ?? ""}`.trim() || "A student";
            const ownerMessage = await renderSmsTemplate("owner_new_booking", {
              student_name: studentName,
              product_name: product?.name ?? "a course",
              details,
            });

            await sendSms({
              profileId: order.profile_id,
              mobile: ownerMobile,
              templateName: "owner_new_booking",
              message: ownerMessage,
            });
          }
        } catch (smsErr) {
          console.error("[stripe webhook] booking notification sms failed", {
            sessionId: session.id,
            orderId: order.id,
            error: smsErr,
          });
        }
      }
      break;
    }

    // Stripe fires this when a Checkout Session's payment window lapses
    // (24h by default) with no payment — e.g. someone opens the assessment
    // date-and-location checkout, reserving that seat (see
    // src/app/api/checkout/route.ts), then just closes the tab instead of
    // hitting "cancel". Without this, that seat would stay held forever.
    // The webhook endpoint must have this event type added in the Stripe
    // Dashboard (Developers → Webhooks → this endpoint → Listen to) for it
    // to actually arrive — subscribing to checkout.session.completed does
    // not automatically add this one too.
    case "checkout.session.expired": {
      const session = event.data.object as Stripe.Checkout.Session;

      const { data: order } = await supabase
        .from("orders")
        .select("id, status")
        .eq("stripe_session_id", session.id)
        .maybeSingle<{ id: string; status: string }>();

      if (order && order.status === "pending") {
        await supabase.from("orders").update({ status: "cancelled" }).eq("id", order.id);
        // Freeing the seat is what fn_book_assessment_slot() actually
        // reacts to (booked -> cancelled decrements assessment_slots.booked_count);
        // updating the order alone wouldn't release the capacity.
        const { error: releaseError } = await supabase
          .from("assessment_bookings")
          .update({ status: "cancelled" })
          .eq("order_id", order.id)
          .eq("status", "booked");

        if (releaseError) {
          console.error("[stripe webhook] failed to release expired booking", {
            sessionId: session.id,
            orderId: order.id,
            error: releaseError,
          });
        }
      }
      break;
    }

    case "price.updated": {
      const price = event.data.object as Stripe.Price;
      await supabase
        .from("products")
        .update({
          price_cents: price.unit_amount ?? undefined,
          stripe_price_id: price.id,
        })
        .eq("stripe_product_id", price.product as string);
      break;
    }

    default:
      // Unhandled event types are fine to ignore — Stripe expects a 2xx
      // response regardless, or it will keep retrying delivery.
      break;
  }

  return NextResponse.json({ received: true });
}
