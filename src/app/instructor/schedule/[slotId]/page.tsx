import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";

interface SlotDetail {
  assessment_date: string;
  assessment_time: string;
  capacity: number;
  booked_count: number;
  active: boolean;
  assessment_locations: { name: string } | null;
}

interface BookingRow {
  id: string;
  status: string;
  booked_at: string;
  students: {
    readiness_score: number;
    assessment_ready: boolean;
    identity_verified: boolean;
    profiles: {
      first_name: string | null;
      last_name: string | null;
      email: string;
      mobile: string | null;
    } | null;
  } | null;
}

// Requested by Scott 22 September 2026: the Schedule page (assessment_slots)
// only ever showed a booked/capacity count for each date, with no way to
// see WHO those seats belonged to short of cross-checking the Bookings
// page by date/time manually. This is that detail view — clicking a date
// on /instructor/schedule links here.
export default async function ScheduleSlotDetailPage({
  params,
}: {
  params: Promise<{ slotId: string }>;
}) {
  const { slotId } = await params;
  const supabase = await createClient();

  const { data: slot } = await supabase
    .from("assessment_slots")
    .select("assessment_date, assessment_time, capacity, booked_count, active, assessment_locations(name)")
    .eq("id", slotId)
    .single<SlotDetail>();

  if (!slot) notFound();

  let bookings: BookingRow[] = [];
  let loadError: string | null = null;

  try {
    // Same fix as admin/bookings and instructor/students: `students` has
    // two foreign keys into `profiles` (profile_id, identity_verified_by),
    // so the embed must say which one to follow via `profiles!profile_id`
    // — see the comment on admin/bookings/page.tsx for the full story.
    const { data, error } = await supabase
      .from("assessment_bookings")
      .select(
        "id, status, booked_at, students(readiness_score, assessment_ready, identity_verified, profiles!profile_id(first_name, last_name, email, mobile))"
      )
      .eq("slot_id", slotId)
      .order("booked_at");
    if (error) throw error;
    bookings = (data as unknown as BookingRow[]) ?? [];
  } catch {
    loadError = "Couldn't load bookings for this date — check this account has the instructor or admin role.";
  }

  return (
    <div className="space-y-4">
      <Link href="/instructor/schedule" className="text-sm font-medium text-wcmt-navy hover:text-wcmt-orange">
        ← Back to Schedule
      </Link>

      <div>
        <h1 className="font-heading text-2xl font-bold text-wcmt-navy">
          {slot.assessment_date} at {slot.assessment_time}
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          {slot.assessment_locations?.name ?? "No location"} · {slot.booked_count} / {slot.capacity} booked ·{" "}
          {slot.active ? "Open" : "Closed"}
        </p>
      </div>

      {loadError && (
        <Card className="border-amber-300 bg-amber-50 text-sm text-amber-800">{loadError}</Card>
      )}

      <Card className="overflow-x-auto p-0">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 text-slate-500">
            <tr>
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Readiness</th>
              <th className="px-4 py-3">ID Verified</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => {
              const profile = b.students?.profiles;
              const name = profile
                ? `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim() || profile.email
                : "—";
              return (
                <tr key={b.id} className="border-b border-slate-100">
                  <td className="px-4 py-3 font-medium text-wcmt-navy">{name}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {profile ? (
                      <div className="flex flex-col">
                        <a href={`mailto:${profile.email}`} className="hover:text-wcmt-orange">
                          {profile.email}
                        </a>
                        {profile.mobile && (
                          <a href={`tel:${profile.mobile}`} className="hover:text-wcmt-orange">
                            {profile.mobile}
                          </a>
                        )}
                      </div>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3 capitalize">{b.status}</td>
                  <td className="px-4 py-3">
                    {b.students ? `${b.students.readiness_score}%${b.students.assessment_ready ? " · Ready" : ""}` : "—"}
                  </td>
                  <td className="px-4 py-3">{b.students?.identity_verified ? "Yes" : "No"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!loadError && bookings.length === 0 && (
          <p className="p-4 text-sm text-slate-500">No one&apos;s booked into this date yet.</p>
        )}
      </Card>
    </div>
  );
}
