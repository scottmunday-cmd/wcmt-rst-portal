import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import { readinessLevel, READINESS_COLORS } from "@/lib/readiness";
import type { Student } from "@/types/database";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    redirect("/login");
  }

  // Defensive: this page will be opened before the schema/migrations have
  // necessarily been run against a fresh Supabase project, so a missing
  // table should show a friendly setup hint instead of crashing the page.
  let student: Student | null = null;
  let loadError: string | null = null;

  try {
    const { data, error } = await supabase
      .from("students")
      .select("*")
      .eq("profile_id", userData.user.id)
      .maybeSingle();

    if (error) throw error;
    student = data;
  } catch {
    loadError =
      "Couldn't load your student record yet — this is expected until the database migrations have been run against your Supabase project.";
  }

  const readinessScore = student?.readiness_score ?? 0;
  const level = readinessLevel(readinessScore);

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold text-wcmt-navy">
        Welcome back{userData.user.user_metadata?.first_name ? `, ${userData.user.user_metadata.first_name}` : ""}
      </h1>

      {loadError && (
        <Card className="border-amber-300 bg-amber-50 text-sm text-amber-800">
          {loadError}
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-sm text-slate-500">Course Progress</p>
          <p className="mt-1 font-heading text-3xl font-bold text-wcmt-navy">
            {student ? `${student.course_status}` : "—"}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500">Readiness Score</p>
          <p
            className="mt-1 font-heading text-3xl font-bold"
            style={{ color: READINESS_COLORS[level] }}
          >
            {readinessScore}%
          </p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500">Assessment</p>
          <p className="mt-1 font-heading text-3xl font-bold text-wcmt-navy">
            {student?.assessment_ready ? "Ready" : "Not yet"}
          </p>
        </Card>
      </div>

      <Card>
        <h2 className="font-heading font-semibold text-wcmt-navy">Quick Actions</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <ButtonLink href="/modules" variant="primary">Continue Learning</ButtonLink>
          <ButtonLink href="/assessment" variant="outline">Book Assessment</ButtonLink>
          <ButtonLink href="/reference" variant="outline">Reference Library</ButtonLink>
        </div>
      </Card>
    </div>
  );
}
