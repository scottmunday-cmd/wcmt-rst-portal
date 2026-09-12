// Original diagrams for the Safe Operations module — not traced from any
// workbook, exam paper or chart.

export function FuelPlanPieChart() {
  // Conic-gradient wedge: 25% out, 25% return, 50% reserve.
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg bg-wcmt-bg p-4 sm:flex-row sm:justify-center">
      <div
        className="h-32 w-32 shrink-0 rounded-full"
        style={{
          background:
            "conic-gradient(#4EA5D9 0% 25%, #2BB673 25% 50%, #F26B38 50% 100%)",
        }}
        aria-hidden="true"
      />
      <div className="space-y-1 text-[11px]">
        <p className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm bg-wcmt-coastal" /> 25% — the trip out
        </p>
        <p className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm bg-wcmt-green" /> 25% — the return trip
        </p>
        <p className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm bg-wcmt-orange" /> 50% — reserve, held back
        </p>
        <p className="mt-2 max-w-[220px] text-slate-500">
          Carry about 50% more fuel in total than you expect to use.
        </p>
      </div>
    </div>
  );
}

function VesselWithG({ gHeight, tender }: { gHeight: number; tender: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-lg bg-wcmt-bg p-3 text-center">
      <svg viewBox="0 0 60 60" className="h-24 w-24" aria-hidden="true">
        <polygon points="10,50 50,50 42,58 18,58" fill="#4EA5D9" opacity="0.5" />
        <polygon points="8,50 52,50 44,20 16,20" fill="#0B2545" />
        <circle cx="30" cy={gHeight} r="4" fill="#F26B38" />
        <text x="30" y={gHeight - 8} textAnchor="middle" fontSize="8" fill="#F26B38" fontWeight="bold">
          G
        </text>
      </svg>
      <p className="text-xs font-semibold text-wcmt-navy">
        {tender ? "High G — tender" : "Low G — stiff"}
      </p>
      <p className="text-[11px] leading-snug text-slate-500">
        {tender
          ? "Slow to return upright, more prone to capsizing."
          : "Returns upright readily, more stable."}
      </p>
    </div>
  );
}

export function StabilityDiagram() {
  return (
    <div className="grid grid-cols-2 gap-3">
      <VesselWithG gHeight={26} tender />
      <VesselWithG gHeight={42} tender={false} />
    </div>
  );
}
