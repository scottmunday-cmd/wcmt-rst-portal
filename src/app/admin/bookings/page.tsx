import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";

interface BookingRow {
  id: string;
  status: string;
  booked_at: string;
  assessment_slots: { assessment_date: string; assessment_time: string } | null;
  students: { profiles: { first_name: string | null; last_name: string | null } | null } | null;
}

export default async function AdminBookingsPage() {
  const supabase = await createClient();
  let bookings: BookingRow[] = [];
  let loadError: string | null = null;

  try {
    const { data, error } = await supabase
      .from("assessment_bookings")
      .select(
        "id, status, booked_at, assessment_slots(assessment_date, assessment_time), students(profiles(first_name, last_name))"
      )
      .order("booked_at", { ascending: false });
    if (error) throw error;
    bookings = (data as unknown as BookingRow[]) ?? [];
  } catch {
    loadError = "Couldn't load bookings yet — check migrations have run and this account has the admin role.";
  }

  return (
    <div className="space-y-4">
      <h1 className="font-heading text-2xl font-bold text-wcmt-navy">Assessment Bookings</h1>
      {loadError && (
        <Card className="border-amber-300 bg-amber-50 text-sm text-amber-800">{loadError}</Card>
      )}
      <Card className="overflow-x-auto p-0">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 text-slate-500">
            <tr>
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3">Slot</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} className="border-b border-slate-100">
                <td className="px-4 py-3">
                  {b.students?.profiles
                    ? `${b.students.profiles.first_name ?? ""} ${b.students.profiles.last_name ?? ""}`.trim()
                    : "—"}
                </td>
                <td className="px-4 py-3">
                  {b.assessment_slots
                    ? `${b.assessment_slots.assessment_date} ${b.assessment_slots.assessment_time}`
                    : "—"}
                </td>
                <td className="px-4 py-3 capitalize">{b.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loadError && bookings.length === 0 && (
          <p className="p-4 text-sm text-slate-500">No bookings yet.</p>
        )}
      </Card>
    </div>
  );
}
