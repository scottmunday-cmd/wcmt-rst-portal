import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";

interface StudentRow {
  id: string;
  readiness_score: number;
  course_status: string;
  assessment_ready: boolean;
  profiles: { first_name: string | null; last_name: string | null; email: string } | null;
}

export default async function InstructorStudentsPage() {
  const supabase = await createClient();
  let students: StudentRow[] = [];
  let loadError: string | null = null;

  try {
    const { data, error } = await supabase
      .from("students")
      .select("id, readiness_score, course_status, assessment_ready, profiles(first_name, last_name, email)")
      .order("readiness_score", { ascending: false });
    if (error) throw error;
    students = (data as unknown as StudentRow[]) ?? [];
  } catch {
    loadError = "Couldn't load students yet — check migrations have run and this account has the instructor role.";
  }

  return (
    <div className="space-y-4">
      <h1 className="font-heading text-2xl font-bold text-wcmt-navy">Students</h1>
      {loadError && (
        <Card className="border-amber-300 bg-amber-50 text-sm text-amber-800">{loadError}</Card>
      )}
      <Card className="overflow-x-auto p-0">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 text-slate-500">
            <tr>
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Readiness</th>
              <th className="px-4 py-3">Assessment</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id} className="border-b border-slate-100">
                <td className="px-4 py-3">
                  {s.profiles ? `${s.profiles.first_name ?? ""} ${s.profiles.last_name ?? ""}`.trim() || s.profiles.email : s.id}
                </td>
                <td className="px-4 py-3 capitalize">{s.course_status}</td>
                <td className="px-4 py-3">{s.readiness_score}%</td>
                <td className="px-4 py-3">{s.assessment_ready ? "Ready" : "Not yet"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loadError && students.length === 0 && (
          <p className="p-4 text-sm text-slate-500">No students enrolled yet.</p>
        )}
      </Card>
    </div>
  );
}
