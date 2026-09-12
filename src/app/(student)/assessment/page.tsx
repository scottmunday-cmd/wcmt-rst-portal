import { createClient, createAdminClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { BookingCalendar, type CalendarSlot } from "@/components/BookingCalendar";

interface SlotRow {
  id: string;
  assessment_date: string;
  assessment_time: string;
  capacity: number;
  booked_count: number;
  assessment_locations: { name: string; travel_surcharge_multiplier: number } | null;
}

// Replaces the old plain "pick any location" flow for the in-person
// assessment (see BuyButton.tsx / the marketing page's pricing cards,
// still used as-is for Private Tuition). Scott's ask, 12 September 2026:
// students were booking locations he had no near-term plan to travel to.
// Now they can only pick a date+location he's actually published here —
// see /instructor/schedule for where those get added, and
// src/app/api/checkout/route.ts for how a pick here reserves the seat
// and starts payment.
export default async function AssessmentPage() {
  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);

  let slots: CalendarSlot[] = [];
  let loadError: string | null = null;

  try {
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("price_cents")
      .eq("slug", "assessment")
      .single<{ price_cents: number }>();
    if (productError || !product) throw productError ?? new Error("assessment product not found");

    const { data: slotRows, error: slotError } = await supabase
      .from("assessment_slots")
      .select(
        "id, assessment_date, assessment_time, capacity, booked_count, assessment_locations(name, travel_surcharge_multiplier)"
      )
      .eq("active", true)
      .gte("assessment_date", today)
      .order("assessment_date")
      .order("assessment_time");
    if (slotError) throw slotError;
    const typedSlotRows = (slotRows as unknown as SlotRow[]) ?? [];

    // settings is admin-only under RLS (see 0002) — same pattern as the
    // marketing page: a service-role read here is safe because it runs
    // server-side only and is never shipped to the browser.
    const admin = createAdminClient();
    const { data: unitSetting } = await admin
      .from("settings")
      .select("setting_value")
      .eq("setting_key", "travel_surcharge_unit_cents")
      .maybeSingle();
    const surchargeUnitCents = Number(unitSetting?.setting_value ?? 5000);

    slots = typedSlotRows.map((row) => ({
      id: row.id,
      date: row.assessment_date,
      time: row.assessment_time,
      locationName: row.assessment_locations?.name ?? "Location TBC",
      priceCents:
        product.price_cents + (row.assessment_locations?.travel_surcharge_multiplier ?? 0) * surchargeUnitCents,
      spotsLeft: Math.max(row.capacity - row.booked_count, 0),
    }));
  } catch {
    loadError = "Couldn't load assessment dates right now — please try again shortly.";
  }

  return (
    <div className="space-y-4">
      <h1 className="font-heading text-2xl font-bold text-wcmt-navy">Book Your Assessment</h1>
      <p className="text-sm text-slate-600">
        You&apos;re not required to book an assessment straight away — study first, then book when
        you&apos;re ready. Pick a highlighted date below to see the location, price and remaining
        spots.
      </p>
      {loadError && (
        <Card className="border-amber-300 bg-amber-50 text-sm text-amber-800">{loadError}</Card>
      )}
      {!loadError && <BookingCalendar productSlug="assessment" slots={slots} />}
    </div>
  );
}
