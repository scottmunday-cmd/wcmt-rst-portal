// Original diagram for the Practical Assessment module — not traced from any
// workbook, exam paper or chart.

const TASKS = [
  "Operate safely (continuous)",
  "Check lines & secure vessel",
  "Safety briefing",
  "Pre-start checks & start motor",
  "Log a voyage plan",
  "Depart berth safely",
  "Recover a person overboard",
  "Hold a course on a transit",
  "Controlled stop within 2 boat lengths",
  "Return to berth & secure",
  "Log off, trip complete",
];

export function PracticalTasksDiagram() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {TASKS.map((task, i) => (
        <div key={task} className="flex items-start gap-2 rounded-lg bg-wcmt-bg p-2.5">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-wcmt-navy text-[10px] font-bold text-white">
            {i + 1}
          </span>
          <p className="text-[11px] leading-snug text-slate-600">{task}</p>
        </div>
      ))}
    </div>
  );
}
