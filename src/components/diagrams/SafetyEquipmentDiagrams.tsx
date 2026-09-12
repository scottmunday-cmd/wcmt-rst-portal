// Original diagrams for the Safety Equipment module — not traced from any
// workbook, exam paper or chart.

function VestIcon({ fill }: { fill: string }) {
  return (
    <svg viewBox="0 0 40 50" className="h-14 w-11" aria-hidden="true">
      <path d="M8 6 L16 2 L20 8 L24 2 L32 6 L30 44 L10 44 Z" fill={fill} />
      <circle cx="20" cy="4" r="3" fill="#334155" />
    </svg>
  );
}

export function LifejacketLevelsDiagram() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div className="flex items-center gap-3 rounded-lg bg-wcmt-bg p-3">
        <VestIcon fill="#F26B38" />
        <div>
          <p className="text-xs font-semibold text-wcmt-navy">Level 100+</p>
          <p className="text-[11px] leading-snug text-slate-500">
            Required on registrable vessels. Highest buoyancy, head and neck support, floats the
            wearer face-up.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 rounded-lg bg-wcmt-bg p-3">
        <VestIcon fill="#4EA5D9" />
        <div>
          <p className="text-xs font-semibold text-wcmt-navy">Level 50 / 50S</p>
          <p className="text-[11px] leading-snug text-slate-500">
            Approved for non-registrable vessels, PWCs and sailboards. No head or neck support.
          </p>
        </div>
      </div>
    </div>
  );
}

export function DistressSignalRow() {
  const items = [
    { label: "Red flare", detail: "Day or night, ~45 sec, several km at night" },
    { label: "Orange smoke flare", detail: "Day only, ~60 sec" },
    { label: "EVDS", detail: "~20 hrs, needs an EPIRB/PLB alongside it" },
    { label: "EPIRB / PLB", detail: "GPS beacon, 24-48+ hrs, register with AMSA" },
  ];
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map((it) => (
        <div key={it.label} className="flex flex-col items-center gap-2 rounded-lg bg-wcmt-bg p-3 text-center">
          <svg viewBox="0 0 20 50" className="h-12 w-5" aria-hidden="true">
            <rect x="6" y="10" width="8" height="36" rx="2" fill="#F26B38" />
            <polygon points="10,0 15,12 5,12" fill="#E11D48" />
          </svg>
          <p className="text-[11px] font-semibold text-wcmt-navy">{it.label}</p>
          <p className="text-[11px] leading-snug text-slate-500">{it.detail}</p>
        </div>
      ))}
    </div>
  );
}

export function RadioUrgencyDiagram() {
  const levels = [
    { label: "Mayday", color: "#E11D48", detail: "Grave and imminent danger — immediate assistance needed." },
    { label: "Pan Pan", color: "#F5C518", detail: "Urgent, but not immediately life-threatening." },
    { label: "Securite", color: "#4EA5D9", detail: "A safety or navigational warning, not a personal emergency." },
  ];
  return (
    <div className="space-y-2">
      {levels.map((l) => (
        <div key={l.label} className="flex items-center gap-3 rounded-lg bg-wcmt-bg p-3">
          <span
            className="flex h-10 w-16 shrink-0 items-center justify-center rounded-md text-xs font-bold text-white"
            style={{ backgroundColor: l.color }}
          >
            {l.label}
          </span>
          <p className="text-[11px] leading-snug text-slate-500">{l.detail}</p>
        </div>
      ))}
    </div>
  );
}
