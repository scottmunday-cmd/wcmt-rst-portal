import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { addLocation, addSlot, toggleLocationActive, toggleSlotActive } from "./actions";

interface LocationRow {
  id: string;
  name: string;
  address: string | null;
  travel_surcharge_multiplier: number;
  active: boolean;
}

interface SlotRow {
  id: string;
  assessment_date: string;
  assessment_time: string;
  capacity: number;
  booked_count: number;
  active: boolean;
  assessment_locations: { name: string } | null;
}

// "Instruction mode" schedule management — added 12 September 2026 per
// Scott's request so students only ever see dates and locations he's
// actually able to get to, instead of picking blind off a location
// dropdown. Every location and date added here is what populates the
// student-facing booking calendar at /assessment (see BookingCalendar.tsx).
export default async function InstructorSchedulePage() {
  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);

  let locations: LocationRow[] = [];
  let slots: SlotRow[] = [];
  let loadError: string | null = null;

  try {
    const [{ data: locationRows, error: locationError }, { data: slotRows, error: slotError }] =
      await Promise.all([
        supabase.from("assessment_locations").select("*").order("name").returns<LocationRow[]>(),
        supabase
          .from("assessment_slots")
          .select(
            "id, assessment_date, assessment_time, capacity, booked_count, active, assessment_locations(name)"
          )
          .gte("assessment_date", today)
          .order("assessment_date")
          .order("assessment_time"),
      ]);
    if (locationError) throw locationError;
    if (slotError) throw slotError;
    locations = locationRows ?? [];
    slots = (slotRows as unknown as SlotRow[]) ?? [];
  } catch {
    loadError =
      "Couldn't load the schedule yet — check migration 0009 has run and this account has the instructor or admin role.";
  }

  const activeLocations = locations.filter((l) => l.active);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-wcmt-navy">Assessment Schedule</h1>
        <p className="mt-1 text-sm text-slate-600">
          Only the locations and dates you add here can be booked at{" "}
          <span className="font-medium">/assessment</span> — students never see a location or date
          you haven&apos;t published.
        </p>
      </div>

      {loadError && (
        <Card className="border-amber-300 bg-amber-50 text-sm text-amber-800">{loadError}</Card>
      )}

      <section className="space-y-3">
        <h2 className="font-heading text-lg font-semibold text-wcmt-navy">Locations</h2>
        <Card className="overflow-x-auto p-0">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-slate-500">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Address</th>
                <th className="px-4 py-3">Travel surcharge units</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {locations.map((loc) => (
                <tr key={loc.id} className="border-b border-slate-100">
                  <td className="px-4 py-3 font-medium text-wcmt-navy">{loc.name}</td>
                  <td className="px-4 py-3 text-slate-500">{loc.address ?? "—"}</td>
                  <td className="px-4 py-3">{loc.travel_surcharge_multiplier}</td>
                  <td className="px-4 py-3">{loc.active ? "Active" : "Inactive"}</td>
                  <td className="px-4 py-3 text-right">
                    <form action={toggleLocationActive}>
                      <input type="hidden" name="id" value={loc.id} />
                      <input type="hidden" name="active" value={String(loc.active)} />
                      <Button type="submit" variant="outline">
                        {loc.active ? "Deactivate" : "Activate"}
                      </Button>
                    </form>
                  </td>
                </tr>
              ))}
              {locations.length === 0 && !loadError && (
                <tr>
                  <td className="p-4 text-sm text-slate-500" colSpan={5}>
                    No locations yet — add your first one below.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>

        <Card>
          <h3 className="font-heading font-semibold text-wcmt-navy">Add a location</h3>
          <form action={addLocation} className="mt-3 grid gap-3 sm:grid-cols-4">
            <input
              name="name"
              required
              placeholder="Name (e.g. Hillarys Boat Harbour)"
              className="rounded-md border border-slate-300 px-3 py-2 text-sm sm:col-span-2"
            />
            <input
              name="address"
              placeholder="Address (optional)"
              className="rounded-md border border-slate-300 px-3 py-2 text-sm sm:col-span-2"
            />
            <input
              name="travel_surcharge_multiplier"
              type="number"
              min={0}
              step={1}
              defaultValue={0}
              placeholder="Surcharge units"
              className="rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
            <Button type="submit" className="sm:col-start-4">
              Add Location
            </Button>
          </form>
          <p className="mt-2 text-xs text-slate-500">
            0 = standard/home base, no extra charge. Each unit adds the shared surcharge amount set
            in Products &amp; Pricing.
          </p>
        </Card>
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-lg font-semibold text-wcmt-navy">Available Dates</h2>
        <Card className="overflow-x-auto p-0">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-slate-500">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Capacity</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {slots.map((slot) => (
                <tr key={slot.id} className="border-b border-slate-100">
                  <td className="px-4 py-3 font-medium text-wcmt-navy">{slot.assessment_date}</td>
                  <td className="px-4 py-3">{slot.assessment_time}</td>
                  <td className="px-4 py-3">{slot.assessment_locations?.name ?? "—"}</td>
                  <td className="px-4 py-3">
                    {slot.booked_count} / {slot.capacity}
                  </td>
                  <td className="px-4 py-3">{slot.active ? "Open" : "Closed"}</td>
                  <td className="px-4 py-3 text-right">
                    <form action={toggleSlotActive}>
                      <input type="hidden" name="id" value={slot.id} />
                      <input type="hidden" name="active" value={String(slot.active)} />
                      <Button type="submit" variant="outline">
                        {slot.active ? "Close" : "Reopen"}
                      </Button>
                    </form>
                  </td>
                </tr>
              ))}
              {slots.length === 0 && !loadError && (
                <tr>
                  <td className="p-4 text-sm text-slate-500" colSpan={6}>
                    No upcoming dates yet — add one below.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>

        <Card>
          <h3 className="font-heading font-semibold text-wcmt-navy">Add a date</h3>
          {activeLocations.length === 0 ? (
            <p className="mt-2 text-sm text-slate-500">
              Add and activate a location above first, then you can publish dates for it here.
            </p>
          ) : (
            <form action={addSlot} className="mt-3 grid gap-3 sm:grid-cols-5">
              <select
                name="location_id"
                required
                className="rounded-md border border-slate-300 px-3 py-2 text-sm sm:col-span-2"
                defaultValue=""
              >
                <option value="" disabled>
                  Location
                </option>
                {activeLocations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </select>
              <input
                name="assessment_date"
                type="date"
                required
                min={today}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
              <input
                name="assessment_time"
                type="time"
                required
                defaultValue="09:00"
                className="rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
              <input
                name="capacity"
                type="number"
                min={1}
                defaultValue={8}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
              <Button type="submit" className="sm:col-start-5">
                Add Date
              </Button>
            </form>
          )}
        </Card>
      </section>
    </div>
  );
}
