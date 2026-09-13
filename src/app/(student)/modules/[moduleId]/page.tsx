import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { ModuleQuiz } from "@/components/ModuleQuiz";
import { PracticeExams } from "@/components/PracticeExams";
import { LessonAudio } from "@/components/LessonAudio";
import { NavigationLightArcs } from "@/components/diagrams/NavigationLightArcs";
import {
  LateralMarksDiagram,
  IsolatedDangerMarkDiagram,
  SafeWaterMarkDiagram,
  CardinalMarksDiagram,
  SpecialMarkDiagram,
  LeadsDiagram,
} from "@/components/diagrams/BuoyageDiagrams";
import { RSTPathwayDiagram, PassMarkGauge } from "@/components/diagrams/IntroPathwayDiagram";
import { BloodAlcoholGauge, SpeedZoneDiagram } from "@/components/diagrams/RulesDiagrams";
import { GiveWayDiagram, SoundSignalDiagram } from "@/components/diagrams/CollisionDiagrams";
import { MaintenanceCycleDiagram } from "@/components/diagrams/MaintenanceDiagram";
import {
  LifejacketLevelsDiagram,
  DistressSignalRow,
  RadioUrgencyDiagram,
} from "@/components/diagrams/SafetyEquipmentDiagrams";
import { SafetyRequirementsTable } from "@/components/diagrams/SafetyRequirementsTable";
import { LifejacketPhotoRow, FlaresPhotoRow, FireExtinguisherPhoto } from "@/components/diagrams/EquipmentPhotos";
import { FuelPlanPieChart, StabilityDiagram } from "@/components/diagrams/SafeOperationsDiagrams";
import { CapsizeResponseDiagram, HelpHuddleDiagram } from "@/components/diagrams/EmergencyDiagrams";
import { PracticalTasksDiagram } from "@/components/diagrams/PracticalTasksDiagram";
import { ModuleHero } from "@/components/diagrams/ModuleHero";
import type { Lesson, Module } from "@/types/database";

// The Mock Assessment module (content/modules/build_content.py, sort_order
// 11) has no questions of its own — it draws full-length practice exams
// from every other module's bank instead, so it gets the dedicated
// PracticeExams component rather than the per-module ModuleQuiz.
const MOCK_ASSESSMENT_SORT_ORDER = 11;

// Diagrams live in code (not the lessons.content text column) so they can be
// original hand-built SVG/CSS rather than images copied from the workbook or
// exam papers. Keyed by (module sort_order, lesson sort_order) — see
// content/modules/build_content.py for which lesson is which.
function lessonDiagram(moduleSortOrder: number, lessonSortOrder: number) {
  // Module 1 — Introduction
  if (moduleSortOrder === 1 && lessonSortOrder === 2) {
    return (
      <div className="space-y-3">
        <RSTPathwayDiagram />
        <div className="grid grid-cols-2 gap-3">
          <PassMarkGauge label="Theory test" passMark={34} total={40} />
          <PassMarkGauge label="Practical test" passMark={56} total={62} />
        </div>
      </div>
    );
  }
  // Module 2 — Rules & Regulations
  if (moduleSortOrder === 2 && lessonSortOrder === 1) {
    return <BloodAlcoholGauge />;
  }
  if (moduleSortOrder === 2 && lessonSortOrder === 2) {
    return <SpeedZoneDiagram />;
  }
  // Module 3 — Collision Avoidance
  if (moduleSortOrder === 3 && lessonSortOrder === 2) {
    return (
      <div className="space-y-3">
        <GiveWayDiagram />
        <SoundSignalDiagram />
      </div>
    );
  }
  // Module 4 — Navigation Lights
  if (moduleSortOrder === 4 && lessonSortOrder === 1) {
    return <NavigationLightArcs />;
  }
  // Module 5 — IALA Buoyage
  if (moduleSortOrder === 5 && lessonSortOrder === 1) {
    return (
      <div className="space-y-3">
        <LateralMarksDiagram />
        <div className="grid grid-cols-2 gap-3">
          <IsolatedDangerMarkDiagram />
          <SafeWaterMarkDiagram />
        </div>
      </div>
    );
  }
  if (moduleSortOrder === 5 && lessonSortOrder === 2) {
    return <CardinalMarksDiagram />;
  }
  if (moduleSortOrder === 5 && lessonSortOrder === 3) {
    return (
      <div className="space-y-3">
        <SpecialMarkDiagram />
        <LeadsDiagram />
      </div>
    );
  }
  // Module 6 — Maintenance
  if (moduleSortOrder === 6 && lessonSortOrder === 2) {
    return <MaintenanceCycleDiagram />;
  }
  // Module 7 — Safety Equipment
  if (moduleSortOrder === 7 && lessonSortOrder === 1) {
    return (
      <div className="space-y-3">
        <SafetyRequirementsTable />
        <LifejacketLevelsDiagram />
        <LifejacketPhotoRow />
        <FireExtinguisherPhoto />
      </div>
    );
  }
  if (moduleSortOrder === 7 && lessonSortOrder === 2) {
    return (
      <div className="space-y-3">
        <DistressSignalRow />
        <FlaresPhotoRow />
      </div>
    );
  }
  if (moduleSortOrder === 7 && lessonSortOrder === 3) {
    return <RadioUrgencyDiagram />;
  }
  // Module 8 — Safe Operations
  if (moduleSortOrder === 8 && lessonSortOrder === 1) {
    return <FuelPlanPieChart />;
  }
  if (moduleSortOrder === 8 && lessonSortOrder === 2) {
    return <StabilityDiagram />;
  }
  // Module 9 — Emergencies
  if (moduleSortOrder === 9 && lessonSortOrder === 1) {
    return <CapsizeResponseDiagram />;
  }
  if (moduleSortOrder === 9 && lessonSortOrder === 3) {
    return <HelpHuddleDiagram />;
  }
  // Module 10 — Practical Assessment
  if (moduleSortOrder === 10 && lessonSortOrder === 2) {
    return <PracticalTasksDiagram />;
  }
  // Module 11 — Mock Assessment
  if (moduleSortOrder === 11 && lessonSortOrder === 1) {
    return <PassMarkGauge label="Mock assessment pass mark" passMark={34} total={40} />;
  }
  return null;
}

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
      {module_ && <ModuleHero moduleSortOrder={module_.sort_order} />}
      {loadError && (
        <Card className="border-amber-300 bg-amber-50 text-sm text-amber-800">{loadError}</Card>
      )}
      <div className="space-y-3">
        {lessons.map((lesson, i) => {
          const diagram = module_ ? lessonDiagram(module_.sort_order, lesson.sort_order) : null;
          return (
          <Card key={lesson.id}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-wcmt-coastal">
                  Lesson {i + 1}
                </p>
                <h2 className="mt-1 font-heading font-semibold text-wcmt-navy">{lesson.title}</h2>
              </div>
              {lesson.content && <LessonAudio text={lesson.content} />}
            </div>
            {diagram && <div className="mt-4">{diagram}</div>}
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
          );
        })}
        {!loadError && lessons.length === 0 && (
          <p className="text-sm text-slate-500">No lessons in this module yet.</p>
        )}
      </div>

      {!loadError && module_?.sort_order === MOCK_ASSESSMENT_SORT_ORDER && (
        <div className="space-y-3 pt-4">
          <h2 className="font-heading text-xl font-bold text-wcmt-navy">Mock Assessment</h2>
          <PracticeExams />
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
