import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { BuyButton, type BuyButtonLocation } from "@/components/BuyButton";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import type { AssessmentLocation, Product } from "@/types/database";

const HOW_IT_WORKS = ["Enrol", "Learn", "Practice", "Assess", "Lifetime Access"];

export default async function HomePage() {
  const supabase = await createClient();

  // products/assessment_locations are publicly readable while active (see
  // the *_read_active RLS policies) — the anon-key client is enough here.
  const [{ data: products }, { data: locations }] = await Promise.all([
    supabase.from("products").select("*").eq("active", true).order("price_cents").returns<Product[]>(),
    supabase
      .from("assessment_locations")
      .select("*")
      .eq("active", true)
      .order("name")
      .returns<AssessmentLocation[]>(),
  ]);

  // settings is admin-only under RLS (see 0002) — this one read uses the
  // service-role client because a public page still needs the surcharge
  // unit to show real per-location prices. Safe: this runs server-side
  // only, in a Server Component, never shipped to the browser.
  const admin = createAdminClient();
  const { data: unitSetting } = await admin
    .from("settings")
    .select("setting_value")
    .eq("setting_key", "travel_surcharge_unit_cents")
    .maybeSingle();
  const surchargeUnitCents = Number(unitSetting?.setting_value ?? 5000);

  function locationOptionsFor(product: Product): BuyButtonLocation[] | undefined {
    if (!product.requires_location || !locations) return undefined;
    return locations.map((loc) => ({
      id: loc.id,
      name: loc.name,
      priceCents: product.price_cents + loc.travel_surcharge_multiplier * surchargeUnitCents,
    }));
  }

  return (
    <>
      <section className="bg-gradient-to-b from-wcmt-navy to-wcmt-ocean px-6 py-20 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-heading text-4xl font-bold sm:text-5xl">
            Learn Online. Boat Safely. Pass With Confidence.
          </h1>
          <p className="mt-4 text-lg text-slate-200">
            Everything you need for your WA Recreational Skipper&apos;s Ticket —
            online training, assessment booking, and a lifetime reference library.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <ButtonLink href="/register" variant="primary">Start Learning</ButtonLink>
            <ButtonLink href="/assessment" variant="outline" className="border-white text-white hover:bg-white hover:text-wcmt-navy">
              Book Assessment
            </ButtonLink>
            <ButtonLink href="/faq" variant="outline" className="border-white text-white hover:bg-white hover:text-wcmt-navy">
              Request Callback
            </ButtonLink>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center font-heading text-2xl font-bold text-wcmt-navy">
            How It Works
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-5">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step} className="text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-wcmt-coastal font-heading font-bold text-white">
                  {i + 1}
                </div>
                <p className="mt-2 text-sm font-medium text-wcmt-navy">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center font-heading text-2xl font-bold text-wcmt-navy">
            Courses &amp; Pricing
          </h2>
          <p className="mt-2 text-center text-sm text-slate-500">
            Prices and availability are managed by WCMT and may change —
            current pricing is always shown at checkout.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(products ?? []).map((product) => (
              <Card key={product.id} className="flex flex-col">
                <h3 className="font-heading font-semibold text-wcmt-navy">{product.name}</h3>
                <p className="mt-1 font-heading text-2xl font-bold text-wcmt-orange">
                  ${(product.price_cents / 100).toFixed(2)}
                  {product.requires_location && <span className="text-base font-medium">+</span>}
                </p>
                {product.requires_location && (
                  <p className="text-xs text-slate-500">Travel surcharge may apply outside Perth metro</p>
                )}
                <p className="mt-2 flex-1 text-sm text-slate-600">{product.description}</p>
                <div className="mt-4">
                  <BuyButton productSlug={product.slug} locations={locationOptionsFor(product)} />
                </div>
              </Card>
            ))}
            {(!products || products.length === 0) && (
              <p className="text-sm text-slate-500">
                No products yet — check the migrations have run against this Supabase project.
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
