import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import type { Lesson, Module } from "@/types/database";

export default async function ModuleDetailPage({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}) {
  const { moduleId } = await params;
  const supabase = await createClient();

  let module_: Module | null = null;
  let lessons: Lesson[] = [];
  let loadError: string | null = null;

  try {
    const [{ data: moduleData, error: moduleErr }, { data: lessonData, error: lessonErr }] =
      await Promise.all([
        supabase.from("modules").select("*").eq("id", moduleId).maybeSingle(),
        supabase
          .from("lessons")
          .select("*")
          .eq("module_id", moduleId)
          .eq("active", true)
          .order("sort_order"),
      ]);
    if (moduleErr) throw moduleErr;
    if (lessonErr) throw lessonErr;
    module_ = moduleData;
    lessons = lessonData ?? [];
  } catch {
    loadError = "Couldn't load this module yet — check that content has been imported.";
  }

  return (
    <div className="space-y-4">
      <h1 className="font-heading text-2xl font-bold text-wcmt-navy">
        {module_?.title ?? `Module ${moduleId}`}
      </h1>
      {loadError && (
        <Card className="border-amber-300 bg-amber-50 text-sm text-amber-800">{loadError}</Card>
      )}
      <div className="space-y-3">
        {lessons.map((lesson, i) => (
          <Card key={lesson.id}>
            <p className="text-xs font-semibold uppercase text-wcmt-coastal">
              Lesson {i + 1}
            </p>
            <h2 className="font-heading font-semibold text-wcmt-navy">{lesson.title}</h2>
          </Card>
        ))}
        {!loadError && lessons.length === 0 && (
          <p className="text-sm text-slate-500">No lessons in this module yet.</p>
        )}
      </div>
    </div>
  );
}
