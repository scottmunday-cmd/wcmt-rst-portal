// Original diagrams for the Rules & Regulations module — not traced from any
// workbook, exam paper or chart.

export function BloodAlcoholGauge() {
  // 0.05 sits at 5% along a 0-1.0 scale, but that's too fine to read, so this
  // is a deliberately simplified "under vs over" gauge rather than a true
  // linear scale.
  return (
    <div className="rounded-lg bg-wcmt-bg p-4">
      <p className="mb-2 text-xs font-semibold text-wcmt-navy">Skipper blood alcohol limit</p>
      <div className="relative h-4 w-full overflow-hidden rounded-full bg-gradient-to-r from-wcmt-green via-wcmt-green to-red-400">
        <div className="absolute inset-y-0 w-0.5 bg-wcmt-navy" style={{ left: "20%" }} />
      </div>
      <div className="mt-1 flex justify-between text-[11px] text-slate-500">
        <span>0.00</span>
        <span className="font-semibold text-wcmt-navy">Limit: 0.05</span>
        <span>Over limit</span>
      </div>
      <p className="mt-2 text-[11px] leading-snug text-slate-500">
        Same limit as driving on the road — it applies to the skipper of any recreational vessel.
      </p>
    </div>
  );
}

const SPEED_SITUATIONS = [
  { label: "Near jetties, wharves or shore", limit: "8 knots", within: "within 50m" },
  { label: "Vessels underway", limit: "8 knots", within: "within 50m" },
  { label: "A person in the water", limit: "8 knots", within: "within 50m" },
  { label: "Mooring areas & shallow water", limit: "8 knots", within: "throughout" },
];

export function SpeedZoneDiagram() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {SPEED_SITUATIONS.map((s) => (
        <div key={s.label} className="flex flex-col items-center gap-1 rounded-lg bg-wcmt-bg p-3 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-red-500 bg-white">
            <span className="text-base font-bold text-wcmt-navy">{s.limit.split(" ")[0]}</span>
          </div>
          <p className="text-[11px] font-semibold text-wcmt-navy">{s.limit}</p>
          <p className="text-[11px] leading-snug text-slate-500">
            {s.label} <span className="text-slate-400">({s.within})</span>
          </p>
        </div>
      ))}
    </div>
  );
}
