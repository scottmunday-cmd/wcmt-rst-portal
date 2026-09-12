import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";

// Stripe redirects here when a student backs out of Checkout (see
// cancel_url in src/app/api/checkout/route.ts). This page didn't exist
// before — cancelling just 404'd — which wasn't a functional problem
// while checkout had nothing else keyed to it, but the assessment
// booking calendar (0009_assessment_slot_booking.sql) reserves a real
// seat the moment checkout starts, so a cancelled checkout now needs to
// actually give that seat back rather than leave it held until Stripe's
// 24h Checkout Session expiry does it (see the webhook's
// checkout.session.expired handler for that slower fallback path).
export default async function CheckoutCancelPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;

  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) redirect("/login");

  let releasedSlot = false;

  if (sessionId) {
    // orders_select RLS (0002) only returns this row if it belongs to the
    // signed-in profile — confirms ownership before we touch anything.
    const { data: order } = await supabase
      .from("orders")
      .select("id, status, assessment_slot_id")
      .eq("stripe_session_id", sessionId)
      .maybeSingle<{ id: string; status: string; assessment_slot_id: string | null }>();

    if (order && order.status === "pending") {
      // orders/assessment_bookings have no update policy for authenticated
      // users (order mutation is server-only by design, see 0002's comment
      // on payments) — the admin client is used here only after the read
      // above already confirmed this order is the signed-in user's own.
      const admin = createAdminClient();
      await admin.from("orders").update({ status: "cancelled" }).eq("id", order.id);

      if (order.assessment_slot_id) {
        await admin
          .from("assessment_bookings")
          .update({ status: "cancelled" })
          .eq("order_id", order.id)
          .eq("status", "booked");
        releasedSlot = true;
      }
    }
  }

  return (
    <div className="mx-auto max-w-lg px-6 py-16">
      <Card className="text-center">
        <h1 className="font-heading text-2xl font-bold text-wcmt-navy">Checkout cancelled</h1>
        <p className="mt-3 text-sm text-slate-600">
          {releasedSlot
            ? "No charge was made, and that date has been released — pick another time whenever you're ready."
            : "No charge was made."}
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <ButtonLink href="/assessment" variant="primary">
            Back to Booking Calendar
          </ButtonLink>
          <Link href="/dashboard" className="text-sm font-medium text-wcmt-orange">
            Go to Dashboard
          </Link>
        </div>
      </Card>
    </div>
  );
}
