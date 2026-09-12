// Original diagrams — the RST pathway as a simple flow, and a reusable
// pass-mark gauge used by the Introduction, Practical Assessment and Mock
// Assessment modules (theory 34/40, practical 56/62).

const STEPS = [
  { label: "Study", detail: "Workbook + practice quizzes" },
  { label: "Theory test", detail: "40 questions, 34 to pass" },
  { label: "Practical test", detail: "62 criteria, 56 to pass" },
  { label: "RST issued", detail: "Certificate on the spot" },
];

export function RSTPathwayDiagram() {
  return (
    <div className="flex flex-wrap items-stretch justify-center gap-2 rounded-lg bg-wcmt-bg p-4">
      {STEPS.map((step, i) => (
        <div key={step.label} className="flex items-center gap-2">
          <div className="flex w-32 flex-col items-center rounded-md bg-white p-3 text-center shadow-sm">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-wcmt-navy text-xs font-bold text-white">
              {i + 1}
            </span>
            <p className="mt-2 text-xs font-semibold text-wcmt-navy">{step.label}</p>
            <p className="mt-1 text-[11px] leading-snug text-slate-500">{step.detail}</p>
          </div>
          {i < STEPS.length - 1 && (
            <span aria-hidden="true" className="text-lg text-wcmt-coastal">
              &rarr;
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

export function PassMarkGauge({
  label,
  passMark,
  total,
}: {
  label: string;
  passMark: number;
  total: number;
}) {
  const pct = (passMark / total) * 100;
  return (
    <div className="rounded-lg bg-wcmt-bg p-4">
      <p className="mb-2 text-xs font-semibold text-wcmt-navy">{label}</p>
      <div className="relative h-4 w-full overflow-hidden rounded-full bg-red-100">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-wcmt-green"
          style={{ width: `${pct}%` }}
        />
        <div
          className="absolute inset-y-0 w-0.5 bg-wcmt-navy"
          style={{ left: `${pct}%` }}
        />
      </div>
      <div className="mt-1 flex justify-between text-[11px] text-slate-500">
        <span>0</span>
        <span className="font-semibold text-wcmt-navy">
          Pass: {passMark}/{total}
        </span>
        <span>{total}</span>
      </div>
    </div>
  );
}
