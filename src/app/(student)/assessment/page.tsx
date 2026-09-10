import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { AssessmentSlot } from "@/types/database";

export default async function AssessmentPage() {
  const supabase = await createClient();
  let slots: AssessmentSlot[] = [];
  let loadError: string | null = null;

  try {
    const { data, error } = await supabase
      .from("assessment_slots")
      .select("*")
      .eq("active", true)
      .order("assessment_date");
    if (error) throw error;
    slots = data ?? [];
  } catch {
    loadError = "Assessment slots haven't been loaded into the database yet.";
  }

  return (
    <div className="space-y-4">
      <h1 className="font-heading text-2xl font-bold text-wcmt-navy">Book Your Assessment</h1>
      <p className="text-sm text-slate-600">
        You&apos;re not required to book an assessment straight away — study first,
        then book when you&apos;re ready.
      </p>
      {loadError && (
        <Card className="border-amber-300 bg-amber-50 text-sm text-amber-800">{loadError}</Card>
      )}
      <div className="grid gap-3 sm:grid-cols-2">
        {slots.map((slot) => {
          const full = slot.booked_count >= slot.capacity;
          return (
            <Card key={slot.id} className="flex items-center justify-between">
              <div>
                <p className="font-heading font-semibold text-wcmt-navy">
                  {slot.assessment_date} · {slot.assessment_time}
                </p>
                <p className="text-sm text-slate-500">
                  {full ? "Fully booked" : `${slot.capacity - slot.booked_count} spots left`}
                </p>
              </div>
              {/*
                Booking submits to a server action / API route that inserts
                into assessment_bookings — capacity is enforced atomically by
                the fn_book_assessment_slot() trigger from the build pack,
                not by this UI, so this button is safe to wire up directly.
              */}
              <Button disabled={full} variant={full ? "outline" : "primary"}>
                {full ? "Full" : "Book"}
              </Button>
            </Card>
          );
        })}
        {!loadError && slots.length === 0 && (
          <p className="text-sm text-slate-500">No assessment slots published yet.</p>
        )}
      </div>
    </div>
  );
}
