import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";

// Stripe redirects here after a completed Checkout Session (see
// success_url in src/app/api/checkout/route.ts). The webhook
// (src/app/api/stripe/webhook/route.ts) is what actually flips the
// order to "paid" — it usually lands within a second or two of the
// redirect, but isn't guaranteed to have run yet by the time this page
// renders, so this page has to handle "still pending" gracefully rather
// than assuming paid.
export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;

  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) redirect("/login");

  let order: { status: string; product_name: string | null } | null = null;

  if (sessionId) {
    // orders_select RLS (0002) only allows a profile to read its own
    // orders, so this is safe with the regular RLS-scoped client — no
    // risk of one customer looking up another's session_id.
    const { data } = await supabase
      .from("orders")
      .select("status, products(name)")
      .eq("stripe_session_id", sessionId)
      .maybeSingle<{ status: string; products: { name: string } | null }>();

    if (data) {
      order = { status: data.status, product_name: data.products?.name ?? null };
    }
  }

  return (
    <div className="mx-auto max-w-lg px-6 py-16">
      <Card className="text-center">
        {order?.status === "paid" && (
          <>
            <h1 className="font-heading text-2xl font-bold text-wcmt-navy">
              You&apos;re all set{order.product_name ? ` — ${order.product_name}` : ""}!
            </h1>
            <p className="mt-3 text-sm text-slate-600">
              Payment received. Your account now has access — head to your
              dashboard to get started.
            </p>
            <ButtonLink href="/dashboard" variant="primary" className="mt-6">
              Go to Dashboard
            </ButtonLink>
          </>
        )}

        {order && order.status !== "paid" && (
          <>
            <h1 className="font-heading text-2xl font-bold text-wcmt-navy">
              Confirming your payment…
            </h1>
            <p className="mt-3 text-sm text-slate-600">
              Stripe says your payment went through — we&apos;re just waiting on
              confirmation to finish updating your account. This is usually
              instant. If this doesn&apos;t update in a minute or two, refresh
              this page.
            </p>
            <ButtonLink href={`/checkout/success?session_id=${sessionId}`} variant="outline" className="mt-6">
              Refresh
            </ButtonLink>
          </>
        )}

        {!order && (
          <>
            <h1 className="font-heading text-2xl font-bold text-wcmt-navy">
              Payment received
            </h1>
            <p className="mt-3 text-sm text-slate-600">
              We couldn&apos;t find the matching order to confirm details here,
              but if Stripe redirected you to this page your payment went
              through. Check your dashboard, or get in touch if anything
              looks off.
            </p>
            <ButtonLink href="/dashboard" variant="primary" className="mt-6">
              Go to Dashboard
            </ButtonLink>
          </>
        )}

        <p className="mt-4 text-xs text-slate-400">
          Questions about your order?{" "}
          <Link href="/faq" className="underline">
            Visit our FAQ
          </Link>
          .
        </p>
      </Card>
    </div>
  );
}
