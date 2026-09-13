// Original decorative header illustration for each module page — a warm,
// rounded-corner "hero" banner that softens the look of a module before the
// student hits a wall of lesson text. Not traced from any workbook, exam
// paper or photo; every shape here is hand-built SVG/CSS.
//
// These are intentionally simple and flat rather than photorealistic, so
// they load instantly, scale cleanly, and carry zero licensing risk.

const SKY = (
  <>
    <rect x="0" y="0" width="400" height="90" fill="url(#sky)" />
    <circle cx="350" cy="28" r="16" fill="#FDE68A" opacity="0.9" />
    <ellipse cx="70" cy="30" rx="26" ry="10" fill="white" opacity="0.7" />
    <ellipse cx="95" cy="24" rx="18" ry="8" fill="white" opacity="0.7" />
  </>
);

const WATER = (
  <path
    d="M0 78 Q50 68 100 78 T200 78 T300 78 T400 78 V100 H0 Z"
    fill="#4EA5D9"
    opacity="0.9"
  />
);

function HeroFrame({
  children,
  accent,
}: {
  children: React.ReactNode;
  accent: string;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-100 shadow-sm">
      <svg viewBox="0 0 400 100" className="h-28 w-full sm:h-32" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#BFE3F5" />
            <stop offset="100%" stopColor="#E8F4FB" />
          </linearGradient>
        </defs>
        {SKY}
        {WATER}
        {children}
      </svg>
      <div className="h-1.5 w-full" style={{ backgroundColor: accent }} />
    </div>
  );
}

function Hull({ x = 150 }: { x?: number }) {
  return (
    <g transform={`translate(${x},60)`}>
      <path d="M-30 20 Q0 30 30 20 L24 32 Q0 38 -24 32 Z" fill="#0B2545" />
      <rect x="-4" y="-2" width="8" height="22" fill="#134074" />
      <polygon points="-2,-2 -2,-18 14,-2" fill="white" opacity="0.9" />
    </g>
  );
}

// Per-module icon motifs, keyed by module sort_order (1-11).
function ModuleIcon({ moduleSortOrder }: { moduleSortOrder: number }) {
  switch (moduleSortOrder) {
    case 1: // Introduction — a certificate ribbon
      return (
        <g transform="translate(320,58)">
          <rect x="-14" y="-16" width="28" height="20" rx="2" fill="white" stroke="#F26B38" strokeWidth="2" />
          <path d="M-6 4 L-10 16 L0 10 L10 16 L6 4" fill="#F26B38" />
        </g>
      );
    case 2: // Rules & Regulations — a flag
      return (
        <g transform="translate(320,45)">
          <rect x="0" y="0" width="2.5" height="30" fill="#334155" />
          <path d="M2.5 0 L22 5 L2.5 12 Z" fill="#F26B38" />
        </g>
      );
    case 3: // Collision Avoidance — two boats passing
      return (
        <g transform="translate(300,62)">
          <Hull x={0} />
          <g transform="translate(30,4) scale(0.8)">
            <Hull x={0} />
          </g>
        </g>
      );
    case 4: // Navigation Lights — a lighthouse beam
      return (
        <g transform="translate(325,40)">
          <rect x="-4" y="0" width="8" height="26" fill="#0B2545" />
          <polygon points="-8,0 8,0 4,-10 -4,-10" fill="#F5C518" />
          <circle cx="0" cy="-10" r="3" fill="white" />
        </g>
      );
    case 5: // IALA Buoyage — a channel marker
      return (
        <g transform="translate(320,58)">
          <rect x="-2" y="0" width="4" height="20" fill="#334155" />
          <rect x="-6" y="-14" width="12" height="14" rx="1" fill="#E11D48" />
        </g>
      );
    case 6: // Maintenance — a wrench
      return (
        <g transform="translate(320,55)">
          <path
            d="M-10 -10 a6 6 0 1 1 8 8 L10 10 L6 14 L-10 -2 Z"
            fill="#334155"
          />
        </g>
      );
    case 7: // Safety Equipment — a life ring
      return (
        <g transform="translate(320,55)">
          <circle cx="0" cy="0" r="14" fill="none" stroke="#E11D48" strokeWidth="6" />
          <circle cx="0" cy="0" r="14" fill="none" stroke="white" strokeWidth="6" strokeDasharray="8 8" />
        </g>
      );
    case 8: // Safe Operations — a fuel drop / gauge
      return (
        <g transform="translate(320,55)">
          <path d="M0 -14 C10 0 10 10 0 14 C-10 10 -10 0 0 -14 Z" fill="#2BB673" />
        </g>
      );
    case 9: // Emergencies — a storm cloud
      return (
        <g transform="translate(320,42)">
          <ellipse cx="0" cy="0" rx="20" ry="10" fill="#64748B" />
          <ellipse cx="12" cy="-4" rx="12" ry="8" fill="#64748B" />
          <path d="M-4 12 L-9 22 M4 12 L-1 24 M12 12 L7 22" stroke="#4EA5D9" strokeWidth="2" />
        </g>
      );
    case 10: // Practical Assessment — a marina berth
      return (
        <g transform="translate(310,55)">
          <rect x="-20" y="0" width="6" height="20" fill="#8B5E3C" />
          <rect x="10" y="0" width="6" height="20" fill="#8B5E3C" />
          <rect x="-24" y="-4" width="44" height="6" fill="#A9764F" />
        </g>
      );
    case 11: // Mock Assessment — a checkmark badge
      return (
        <g transform="translate(320,55)">
          <circle cx="0" cy="0" r="15" fill="#2BB673" />
          <path d="M-6 0 L-2 5 L7 -7" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      );
    default:
      return null;
  }
}

const ACCENTS: Record<number, string> = {
  1: "#F26B38",
  2: "#134074",
  3: "#E11D48",
  4: "#F5C518",
  5: "#E11D48",
  6: "#334155",
  7: "#E11D48",
  8: "#2BB673",
  9: "#64748B",
  10: "#8B5E3C",
  11: "#2BB673",
};

export function ModuleHero({ moduleSortOrder }: { moduleSortOrder: number }) {
  const accent = ACCENTS[moduleSortOrder] ?? "#4EA5D9";
  return (
    <HeroFrame accent={accent}>
      <Hull x={150} />
      <ModuleIcon moduleSortOrder={moduleSortOrder} />
    </HeroFrame>
  );
}
