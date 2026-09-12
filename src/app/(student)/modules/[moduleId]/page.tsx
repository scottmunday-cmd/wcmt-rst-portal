import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { ModuleQuiz } from "@/components/ModuleQuiz";
import { MockExamQuiz } from "@/components/MockExamQuiz";
import type { Lesson, Module } from "@/types/database";

// The Mock Assessment module (content/modules/build_content.py, sort_order
// 11) has no questions of its own — it draws a full 40-question practice
// exam from every other module's bank instead, so it gets the dedicated
// MockExamQuiz component rather than the per-module ModuleQuiz.
const MOCK_ASSESSMENT_SORT_ORDER = 11;

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

  const numericModuleId = module_?.id ?? Number(moduleId);

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
            <h2 className="mt-1 font-heading font-semibold text-wcmt-navy">{lesson.title}</h2>
            {lesson.content && (
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-slate-700">
                {lesson.content
                  .split(/\n{2,}/)
                  .map((s) => s.trim())
                  .filter(Boolean)
                  .map((paragraph, pIdx) => (
                    <p key={pIdx}>{paragraph}</p>
                  ))}
              </div>
            )}
            {lesson.video_url && (
              <a
                href={lesson.video_url}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-block text-sm font-medium text-wcmt-coastal hover:underline"
              >
                Watch video
              </a>
            )}
          </Card>
        ))}
        {!loadError && lessons.length === 0 && (
          <p className="text-sm text-slate-500">No lessons in this module yet.</p>
        )}
      </div>

      {!loadError && module_?.sort_order === MOCK_ASSESSMENT_SORT_ORDER && (
        <div className="space-y-3 pt-4">
          <h2 className="font-heading text-xl font-bold text-wcmt-navy">Mock Assessment</h2>
          <MockExamQuiz />
        </div>
      )}
      {!loadError &&
        module_?.sort_order !== MOCK_ASSESSMENT_SORT_ORDER &&
        !Number.isNaN(numericModuleId) && (
          <div className="space-y-3 pt-4">
            <h2 className="font-heading text-xl font-bold text-wcmt-navy">Practice Quiz</h2>
            <ModuleQuiz moduleId={numericModuleId} />
          </div>
        )}
    </div>
  );
}
