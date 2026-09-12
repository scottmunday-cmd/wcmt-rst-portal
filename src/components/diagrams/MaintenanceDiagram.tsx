// Original diagram for the Maintenance module — not traced from any
// workbook, exam paper or chart.

const ROUTINE = [
  { label: "Pre-trip", items: "Hull check, oil & coolant, dry bilges, test steering" },
  { label: "Post-trip", items: "Flush engine, remove rubbish/metal, protect fuel lines" },
  { label: "Monthly", items: "Check safety gear, flare & EVDS dates, test bilge pump" },
  { label: "Yearly", items: "Service motor, gearbox oil, anodes, through-hull fittings" },
];

export function MaintenanceCycleDiagram() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {ROUTINE.map((r, i) => (
        <div key={r.label} className="flex flex-col gap-1 rounded-lg bg-wcmt-bg p-3">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-wcmt-navy text-xs font-bold text-white">
              {i + 1}
            </span>
            <p className="text-xs font-semibold text-wcmt-navy">{r.label}</p>
          </div>
          <p className="text-[11px] leading-snug text-slate-500">{r.items}</p>
        </div>
      ))}
    </div>
  );
}
