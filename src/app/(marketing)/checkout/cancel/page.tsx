import { Card } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";

// Stripe redirects here if someone backs out of Checkout before paying
// (see cancel_url in src/app/api/checkout/route.ts). No order was
// created for this attempt to clean up — the order row in
// /api/checkout is only ever created just before the Stripe redirect,
// and simply sits as "pending" if never completed.
export default function CheckoutCancelPage() {
  return (
    <div className="mx-auto max-w-lg px-6 py-16">
      <Card className="text-center">
        <h1 className="font-heading text-2xl font-bold text-wcmt-navy">
          Checkout cancelled
        </h1>
        <p className="mt-3 text-sm text-slate-600">
          No payment was taken. Whenever you&apos;re ready, you can head back
          and pick a course to get started.
        </p>
        <ButtonLink href="/#pricing" variant="primary" className="mt-6">
          Back to Pricing
        </ButtonLink>
      </Card>
    </div>
  );
}
