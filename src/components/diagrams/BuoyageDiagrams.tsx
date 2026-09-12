// Original SVG icons (not traced from any workbook, exam paper or chart) for
// the IALA buoyage marks covered in the IALA Buoyage module. Kept as simple,
// flat vector shapes rather than photographs, so they render crisply at any
// size with no image assets to host.

function MarkCard({
  label,
  sub,
  children,
}: {
  label: string;
  sub: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-lg bg-wcmt-bg p-3 text-center">
      <svg viewBox="0 0 60 100" className="h-24 w-16" aria-hidden="true">
        {children}
      </svg>
      <p className="text-xs font-semibold text-wcmt-navy">{label}</p>
      <p className="text-[11px] leading-snug text-slate-500">{sub}</p>
    </div>
  );
}

const WATER = (
  <path d="M0 90 Q15 85 30 90 T60 90 V100 H0 Z" fill="#4EA5D9" opacity="0.35" />
);
const POLE = <rect x="27" y="55" width="6" height="35" fill="#334155" />;

export function LateralMarksDiagram() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
      <MarkCard label="Port mark" sub="Red, can-shaped. Keep to port when entering harbour or heading upstream.">
        <rect x="15" y="35" width="30" height="20" rx="2" fill="#E11D48" />
        <rect x="15" y="30" width="30" height="6" fill="#E11D48" />
        {POLE}
        {WATER}
      </MarkCard>
      <MarkCard label="Starboard mark" sub="Green, cone-shaped. Keep to starboard when entering harbour or heading upstream.">
        <polygon points="30,20 45,55 15,55" fill="#2BB673" />
        {POLE}
        {WATER}
      </MarkCard>
    </div>
  );
}

export function IsolatedDangerMarkDiagram() {
  return (
    <MarkCard label="Isolated danger mark" sub="Black with a red band. Two black spheres on top — pass well clear on any side.">
      <rect x="20" y="35" width="20" height="20" fill="#0B2545" />
      <rect x="20" y="42" width="20" height="6" fill="#E11D48" />
      <circle cx="30" cy="28" r="6" fill="#0B2545" />
      <circle cx="30" cy="16" r="6" fill="#0B2545" />
      {POLE}
      {WATER}
    </MarkCard>
  );
}

export function SafeWaterMarkDiagram() {
  return (
    <MarkCard label="Safe water mark" sub="Red and white vertical stripes, single red sphere on top. Safe water all around.">
      <rect x="18" y="35" width="24" height="20" fill="white" stroke="#cbd5e1" />
      <rect x="18" y="35" width="6" height="20" fill="#E11D48" />
      <rect x="30" y="35" width="6" height="20" fill="#E11D48" />
      <circle cx="30" cy="24" r="7" fill="#E11D48" />
      {POLE}
      {WATER}
    </MarkCard>
  );
}

export function SpecialMarkDiagram() {
  return (
    <MarkCard label="Special mark" sub="Yellow, often with a yellow 'X' on top. Marks a feature, not a hazard to route around.">
      <rect x="18" y="35" width="24" height="20" fill="#F5C518" />
      <g stroke="#F5C518" strokeWidth="4">
        <line x1="22" y1="16" x2="38" y2="30" />
        <line x1="38" y1="16" x2="22" y2="30" />
      </g>
      {POLE}
      {WATER}
    </MarkCard>
  );
}

type CardinalDir = "N" | "E" | "S" | "W";

function CardinalIcon({ dir }: { dir: CardinalDir }) {
  // Body bands (top -> bottom) and cone orientation per direction, matching
  // the standard IALA scheme: cones point toward the black band(s).
  const bands: Record<CardinalDir, { top: string; mid?: string; bottom: string }> = {
    N: { top: "#0B2545", bottom: "#F5C518" },
    E: { top: "#0B2545", mid: "#F5C518", bottom: "#0B2545" },
    S: { top: "#F5C518", bottom: "#0B2545" },
    W: { top: "#F5C518", mid: "#0B2545", bottom: "#F5C518" },
  };
  const b = bands[dir];
  return (
    <svg viewBox="0 0 60 100" className="h-24 w-16" aria-hidden="true">
      {b.mid ? (
        <>
          <rect x="18" y="35" width="24" height="7" fill={b.top} />
          <rect x="18" y="42" width="24" height="6" fill={b.mid} />
          <rect x="18" y="48" width="24" height="7" fill={b.bottom} />
        </>
      ) : (
        <>
          <rect x="18" y="35" width="24" height="10" fill={b.top} />
          <rect x="18" y="45" width="24" height="10" fill={b.bottom} />
        </>
      )}
      {/* Topmark cones */}
      {dir === "N" && (
        <>
          <polygon points="30,10 38,22 22,22" fill="#0B2545" />
          <polygon points="30,20 38,32 22,32" fill="#0B2545" />
        </>
      )}
      {dir === "S" && (
        <>
          <polygon points="30,22 38,10 22,10" fill="#0B2545" />
          <polygon points="30,32 38,20 22,20" fill="#0B2545" />
        </>
      )}
      {dir === "E" && (
        <>
          <polygon points="30,10 38,22 22,22" fill="#0B2545" />
          <polygon points="30,32 38,20 22,20" fill="#0B2545" />
        </>
      )}
      {dir === "W" && (
        <>
          <polygon points="30,22 38,10 22,10" fill="#0B2545" />
          <polygon points="30,20 38,32 22,32" fill="#0B2545" />
        </>
      )}
      {POLE}
      {WATER}
    </svg>
  );
}

const CARDINAL_COPY: Record<CardinalDir, string> = {
  N: "Both cones point up, black over yellow. Pass to the north.",
  E: "Cones point away from each other, black-yellow-black. Pass to the east.",
  S: "Both cones point down, yellow over black. Pass to the south.",
  W: "Cones point towards each other, yellow-black-yellow. Pass to the west.",
};

export function CardinalMarksDiagram() {
  const dirs: CardinalDir[] = ["N", "E", "S", "W"];
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {dirs.map((dir) => (
        <div key={dir} className="flex flex-col items-center gap-2 rounded-lg bg-wcmt-bg p-3 text-center">
          <CardinalIcon dir={dir} />
          <p className="text-xs font-semibold text-wcmt-navy">
            {{ N: "North", E: "East", S: "South", W: "West" }[dir]} cardinal
          </p>
          <p className="text-[11px] leading-snug text-slate-500">{CARDINAL_COPY[dir]}</p>
        </div>
      ))}
    </div>
  );
}

export function LeadsDiagram() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="flex flex-col items-center gap-2 rounded-lg bg-wcmt-bg p-3 text-center">
        <svg viewBox="0 0 100 80" className="h-20 w-28" aria-hidden="true">
          <polygon points="50,10 58,24 42,24" fill="#E11D48" />
          <line x1="50" y1="24" x2="50" y2="45" stroke="#334155" strokeWidth="3" />
          <polygon points="50,45 58,59 42,59" fill="#E11D48" />
          <line x1="50" y1="59" x2="50" y2="70" stroke="#334155" strokeWidth="3" />
          <line x1="50" y1="5" x2="50" y2="75" stroke="#2BB673" strokeWidth="1.5" strokeDasharray="3 3" />
        </svg>
        <p className="text-xs font-semibold text-wcmt-navy">On the safe track</p>
        <p className="text-[11px] leading-snug text-slate-500">
          Rear lead directly above the front lead — you are on the safe course.
        </p>
      </div>
      <div className="flex flex-col items-center gap-2 rounded-lg bg-wcmt-bg p-3 text-center">
        <svg viewBox="0 0 100 80" className="h-20 w-28" aria-hidden="true">
          <polygon points="66,10 74,24 58,24" fill="#E11D48" />
          <line x1="66" y1="24" x2="50" y2="45" stroke="#334155" strokeWidth="3" />
          <polygon points="50,45 58,59 42,59" fill="#E11D48" />
          <line x1="50" y1="59" x2="50" y2="70" stroke="#334155" strokeWidth="3" />
        </svg>
        <p className="text-xs font-semibold text-wcmt-navy">Off the safe track</p>
        <p className="text-[11px] leading-snug text-slate-500">
          Marks no longer line up — you have drifted off course and need to correct back.
        </p>
      </div>
    </div>
  );
}
