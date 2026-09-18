import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { hasPaidAccess } from "@/lib/access";
import { PaywallGate } from "@/components/PaywallGate";
import { Card } from "@/components/ui/Card";
import { GiveWayDiagram, SoundSignalDiagram } from "@/components/diagrams/CollisionDiagrams";
import { NavigationLightArcs } from "@/components/diagrams/NavigationLightArcs";
import {
  LateralMarksDiagram,
  IsolatedDangerMarkDiagram,
  SafeWaterMarkDiagram,
  CardinalMarksDiagram,
  SpecialMarkDiagram,
  LeadsDiagram,
} from "@/components/diagrams/BuoyageDiagrams";
import { SafetyRequirementsTable } from "@/components/diagrams/SafetyRequirementsTable";
import {
  LifejacketLevelsDiagram,
  DistressSignalRow,
  RadioUrgencyDiagram,
} from "@/components/diagrams/SafetyEquipmentDiagrams";
import { ModuleSummaries } from "@/components/diagrams/ModuleSummaries";
import type { ReferenceArticle } from "@/types/database";

// A quick-reference "cheat sheet" for lifetime access — built to be glanced
// at on a phone while out on the water, not read top to bottom like the
// modules. Each section is a native <details>, closed by default so the page
// stays short to scroll on mobile; tapping a quick-nav pill jumps straight to
// a section and opens it (browsers auto-expand a <details> that contains the
// link target). Everything here is our own original artwork/wording — see
// the individual diagram components for the copyright note on why.
const SECTIONS = [
  { id: "give-way", label: "Give-Way Rules" },
  { id: "nav-lights", label: "Navigation Lights" },
  { id: "marks", label: "Marks & Lights" },
  { id: "safety-equipment", label: "Safety Equipment" },
  { id: "module-summaries", label: "Module Summaries" },
  { id: "official-handbook", label: "Official Handbook" },
] as const;

function Section({
  id,
  title,
  defaultOpen,
  children,
}: {
  id: string;
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  return (
    <details id={id} open={defaultOpen} className="scroll-mt-24 rounded-xl border border-slate-200 bg-white shadow-sm">
      <summary className="cursor-pointer select-none list-none rounded-xl px-4 py-3 font-heading font-semibold text-wcmt-navy marker:content-none [&::-webkit-details-marker]:hidden">
        <span className="flex items-center justify-between gap-2">
          {title}
          <span className="text-xs font-normal text-wcmt-coastal">tap to open/close</span>
        </span>
      </summary>
      <div className="space-y-3 border-t border-slate-100 p-4">{children}</div>
    </details>
  );
}

export default async function ReferenceLibraryPage() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) redirect("/login");

  if (!(await hasPaidAccess(supabase, userData.user.id))) {
    return <PaywallGate />;
  }

  let articles: ReferenceArticle[] = [];
  let loadError: string | null = null;

  try {
    const { data, error } = await supabase
      .from("reference_articles")
      .select("*")
      .eq("active", true)
      .order("category");
    if (error) throw error;
    articles = data ?? [];
  } catch {
    loadError = "The reference library hasn't been populated yet.";
  }

  const byCategory = articles.reduce<Record<string, ReferenceArticle[]>>((acc, article) => {
    (acc[article.category] ??= []).push(article);
    return acc;
  }, {});

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-heading text-2xl font-bold text-wcmt-navy">Reference Library</h1>
        <p className="text-sm text-slate-600">
          Lifetime access — a quick-reference cheat sheet you can pull up on your phone if
          you&apos;re ever unsure out on the water.
        </p>
      </div>

      <div className="sticky top-0 z-10 -mx-6 flex gap-2 overflow-x-auto bg-wcmt-bg/95 px-6 py-2 backdrop-blur sm:mx-0 sm:flex-wrap sm:overflow-visible sm:rounded-lg sm:px-2">
        {SECTIONS.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="shrink-0 rounded-full border border-wcmt-navy/20 bg-white px-3 py-1.5 text-xs font-semibold text-wcmt-navy shadow-sm hover:border-wcmt-orange hover:text-wcmt-orange"
          >
            {s.label}
          </a>
        ))}
      </div>

      <div className="space-y-3">
        <Section id="give-way" title="Give-Way Rules" defaultOpen>
          <p className="text-xs leading-snug text-slate-500">
            Look to the right, give way to the right, turn to the right, stay to the right. You&apos;re
            always responsible for avoiding a collision, even if you have right of way.
          </p>
          <GiveWayDiagram />
          <SoundSignalDiagram />
        </Section>

        <Section id="nav-lights" title="Navigation Lights">
          <p className="text-xs leading-snug text-slate-500">
            Red to port, green to starboard, white astern. Show lights sunset to sunrise, and in
            restricted visibility.
          </p>
          <NavigationLightArcs />
        </Section>

        <Section id="marks" title="Marks & Lights">
          <p className="text-xs leading-snug text-slate-500">
            Shape and colour tell you what a mark means by day; the light rhythm tells you the same
            thing at night.
          </p>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-wcmt-coastal">
              Lateral marks
            </p>
            <LateralMarksDiagram />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-wcmt-coastal">
                Isolated danger
              </p>
              <IsolatedDangerMarkDiagram />
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-wcmt-coastal">
                Safe water
              </p>
              <SafeWaterMarkDiagram />
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-wcmt-coastal">
              Cardinal marks
            </p>
            <CardinalMarksDiagram />
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-wcmt-coastal">
              Special mark
            </p>
            <SpecialMarkDiagram />
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-wcmt-coastal">
              Leads
            </p>
            <LeadsDiagram />
          </div>
        </Section>

        <Section id="safety-equipment" title="Safety Equipment">
          <SafetyRequirementsTable />
          <LifejacketLevelsDiagram />
          <DistressSignalRow />
          <RadioUrgencyDiagram />
        </Section>

        <Section id="module-summaries" title="Module Summaries">
          <p className="text-xs leading-snug text-slate-500">
            The key points from every module, condensed to a glance — handy for a refresher without
            digging back through the full lesson.
          </p>
          <ModuleSummaries />
        </Section>

        <Section id="official-handbook" title="Official Handbook">
          <p className="text-sm leading-relaxed text-slate-600">
            Everything here is our own study material, written to help it sink in. For the official
            source — the exact wording the theory test is written against — the WA Department of
            Transport publishes the Recreational Skipper&apos;s Ticket workbook free on their site.
          </p>
          <a
            href="https://www.transport.wa.gov.au/marine/recreational-boating/recreational-skippers-ticket/rst-workbook-quizzes"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md bg-wcmt-navy px-4 py-2.5 font-heading text-sm font-semibold text-white hover:opacity-90"
          >
            Open the official RST workbook (Transport WA) ↗
          </a>
        </Section>
      </div>

      {loadError && (
        <Card className="border-amber-300 bg-amber-50 text-sm text-amber-800">{loadError}</Card>
      )}
      {Object.entries(byCategory).map(([category, items]) => (
        <div key={category}>
          <h2 className="font-heading font-semibold text-wcmt-navy">{category}</h2>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {items.map((article) => (
              <Card key={article.id} className="text-sm">{article.title}</Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
