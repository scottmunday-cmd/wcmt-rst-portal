// Original SVG icons (not traced from any workbook, exam paper or chart) for
// the IALA buoyage marks covered in the IALA Buoyage module. Kept as simple,
// flat vector shapes rather than photographs, so they render crisply at any
// size with no image assets to host.
//
// Light-rhythm bars: students often mix up which flash pattern goes with
// which mark, so each card also shows a small "on/off" timing bar for that
// mark's light characteristic — own artwork, own colour convention (a solid
// block = the light is on), not copied from any chart or workbook diagram.

type LightSeg = { on: boolean; w: number };

// n short flashes evenly spaced with a short gap after each (used for a
// continuous quick/very-quick rhythm, e.g. the North cardinal's light).
function quick(n: number): LightSeg[] {
  const segs: LightSeg[] = [];
  for (let i = 0; i < n; i++) {
    segs.push({ on: true, w: 2 }, { on: false, w: 2 });
  }
  return segs;
}

// A group of n short flashes, then a long dark period before the group
// repeats — e.g. Group Flashing (2) on an isolated danger mark.
function group(n: number, dark = 10, gap = 2): LightSeg[] {
  const segs: LightSeg[] = [];
  for (let i = 0; i < n; i++) {
    segs.push({ on: true, w: 2 }, { on: false, w: i < n - 1 ? gap : dark });
  }
  return segs;
}

const RHYTHMS = {
  flashing: [{ on: true, w: 2 }, { on: false, w: 10 }] as LightSeg[],
  quickContinuous: quick(7),
  groupFlash2: group(2),
  groupFlash3: group(3),
  groupFlash6PlusLong: [...group(6, 3), { on: true, w: 6 }, { on: false, w: 10 }] as LightSeg[],
  groupFlash9: group(9),
  isophase: [{ on: true, w: 7 }, { on: false, w: 7 }] as LightSeg[],
  occulting: [{ on: true, w: 10 }, { on: false, w: 3 }] as LightSeg[],
  longFlash10s: [{ on: true, w: 4 }, { on: false, w: 20 }] as LightSeg[],
};

function LightRhythmBar({
  label,
  color = "#0B2545",
  pattern,
}: {
  label: string;
  color?: string;
  pattern: LightSeg[];
}) {
  const total = pattern.reduce((s, p) => s + p.w, 0);
  let x = 0;
  return (
    <div className="flex w-full flex-col items-center gap-0.5">
      <svg
        viewBox={`0 0 ${total} 12`}
        preserveAspectRatio="none"
        className="h-3 w-full max-w-[120px]"
        aria-hidden="true"
      >
        <rect x="0" y="0" width={total} height="12" fill="#FFFFFF" stroke="#cbd5e1" strokeWidth="0.5" />
        {pattern.map((seg, i) => {
          const rect = seg.on ? <rect key={i} x={x} y="0" width={seg.w} height="12" fill={color} /> : null;
          x += seg.w;
          return rect;
        })}
      </svg>
      <p className="text-[9px] font-medium leading-tight text-slate-500">{label}</p>
    </div>
  );
}

function MarkCard({
  label,
  sub,
  lights,
  children,
}: {
  label: string;
  sub: string;
  lights?: { label: string; color?: string; pattern: LightSeg[] }[];
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-lg bg-wcmt-bg p-3 text-center">
      <svg viewBox="0 0 60 100" className="h-24 w-16" aria-hidden="true">
        {children}
      </svg>
      <p className="text-xs font-semibold text-wcmt-navy">{label}</p>
      <p className="text-[11px] leading-snug text-slate-500">{sub}</p>
      {lights && lights.length > 0 && (
        <div className="mt-1 flex w-full flex-col items-center gap-1.5 border-t border-slate-200 pt-2">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-wcmt-coastal">Light</p>
          <div className="flex w-full flex-col gap-1.5">
            {lights.map((l, i) => (
              <LightRhythmBar key={i} label={l.label} color={l.color} pattern={l.pattern} />
            ))}
          </div>
        </div>
      )}
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
      <MarkCard
        label="Port mark"
        sub="Red, can-shaped. Keep to port when entering harbour or heading upstream."
        lights={[
          { label: "Red — any rhythm except Gp Fl (2+1). Example: Flashing", color: "#E11D48", pattern: RHYTHMS.flashing },
        ]}
      >
        <rect x="15" y="35" width="30" height="20" rx="2" fill="#E11D48" />
        <rect x="15" y="30" width="30" height="6" fill="#E11D48" />
        {POLE}
        {WATER}
      </MarkCard>
      <MarkCard
        label="Starboard mark"
        sub="Green, cone-shaped. Keep to starboard when entering harbour or heading upstream."
        lights={[
          { label: "Green — any rhythm except Gp Fl (2+1). Example: Flashing", color: "#2BB673", pattern: RHYTHMS.flashing },
        ]}
      >
        <polygon points="30,20 45,55 15,55" fill="#2BB673" />
        {POLE}
        {WATER}
      </MarkCard>
    </div>
  );
}

export function IsolatedDangerMarkDiagram() {
  return (
    <MarkCard
      label="Isolated danger mark"
      sub="Black with a red band. Two black spheres on top — pass well clear on any side."
      lights={[
        { label: "White — Group Flashing (2). Memory jog: two flashes for two spheres", color: "#0B2545", pattern: RHYTHMS.groupFlash2 },
      ]}
    >
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
    <MarkCard
      label="Safe water mark"
      sub="Red and white vertical stripes, single red sphere on top. Safe water all around."
      lights={[
        { label: "White — Isophase (equal light and dark)", color: "#0B2545", pattern: RHYTHMS.isophase },
        { label: "White — Occulting (light longer than dark)", color: "#0B2545", pattern: RHYTHMS.occulting },
        { label: "White — Long Flash every 10s", color: "#0B2545", pattern: RHYTHMS.longFlash10s },
      ]}
    >
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
    <MarkCard
      label="Special mark"
      sub="Yellow, often with a yellow 'X' on top. Marks a feature, not a hazard to route around."
      lights={[
        { label: "Yellow — any rhythm not used above. Example: Flashing", color: "#F5C518", pattern: RHYTHMS.flashing },
      ]}
    >
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

// Mnemonic students already respond well to: the number of flashes matches
// where the direction sits on a clock face (E = 3 o'clock, S = 6 o'clock,
// W = 9 o'clock). South also tacks on one long flash so it's never mistaken
// for a mis-counted group.
const CARDINAL_LIGHT: Record<CardinalDir, { label: string; pattern: LightSeg[] }> = {
  N: { label: "White — continuous Quick (or Very Quick) Flashing", pattern: RHYTHMS.quickContinuous },
  E: { label: "White — Quick Flashing (3), like 3 o'clock", pattern: RHYTHMS.groupFlash3 },
  S: { label: "White — Quick Flashing (6) + one long flash, like 6 o'clock", pattern: RHYTHMS.groupFlash6PlusLong },
  W: { label: "White — Quick Flashing (9), like 9 o'clock", pattern: RHYTHMS.groupFlash9 },
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
          <div className="mt-1 flex w-full flex-col items-center gap-1 border-t border-slate-200 pt-2">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-wcmt-coastal">Light</p>
            <LightRhythmBar label={CARDINAL_LIGHT[dir].label} color="#0B2545" pattern={CARDINAL_LIGHT[dir].pattern} />
          </div>
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
