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

// Night variants — Navigation Lights (module 4) is the one module where a
// sunny sky doesn't make sense: sidelights are a night-time (or restricted
// visibility) picture. Added 21 October 2026 at Scott's request. Same water
// path as the day version, just darker, so the horizon lines up exactly.
const NIGHT_SKY = (
  <>
    <rect x="0" y="0" width="400" height="90" fill="url(#nightSky)" />
    <circle cx="350" cy="26" r="13" fill="#F1F5F9" opacity="0.9" />
    <circle cx="60" cy="18" r="1.4" fill="white" opacity="0.8" />
    <circle cx="110" cy="34" r="1" fill="white" opacity="0.6" />
    <circle cx="200" cy="16" r="1.4" fill="white" opacity="0.8" />
    <circle cx="250" cy="40" r="1" fill="white" opacity="0.5" />
    <circle cx="30" cy="48" r="1" fill="white" opacity="0.6" />
    <circle cx="160" cy="50" r="1.2" fill="white" opacity="0.7" />
  </>
);

const NIGHT_WATER = (
  <path
    d="M0 78 Q50 68 100 78 T200 78 T300 78 T400 78 V100 H0 Z"
    fill="#1B3A5C"
    opacity="0.95"
  />
);

function HeroFrame({
  children,
  accent,
  night = false,
}: {
  children: React.ReactNode;
  accent: string;
  night?: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-100 shadow-sm">
      <svg viewBox="0 0 400 100" className="h-28 w-full sm:h-32" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#BFE3F5" />
            <stop offset="100%" stopColor="#E8F4FB" />
          </linearGradient>
          <linearGradient id="nightSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0B1026" />
            <stop offset="100%" stopColor="#1E3A5F" />
          </linearGradient>
        </defs>
        {night ? NIGHT_SKY : SKY}
        {night ? NIGHT_WATER : WATER}
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
    case 1: // Introduction — a single "certificate card with a tick" icon. Replaced
    // the ribbon-plus-ticket-card pairing (21 October 2026, at Scott's
    // request) with one combined graphic: a card with a checkmark badge
    // overlapping its top-left corner, echoing the WA Recreational
    // Skipper's Ticket without reproducing its actual artwork, wording or
    // government crest.
      return (
        <g transform="translate(312,55)">
          <rect x="-16" y="-13" width="32" height="26" rx="3" fill="white" stroke="#134074" strokeWidth="2" />
          <line x1="2" y1="-5" x2="13" y2="-5" stroke="#CBD5E1" strokeWidth="1.6" />
          <line x1="2" y1="0" x2="13" y2="0" stroke="#CBD5E1" strokeWidth="1.6" />
          <line x1="2" y1="5" x2="9" y2="5" stroke="#CBD5E1" strokeWidth="1.6" />
          <circle cx="-9" cy="-7" r="9" fill="white" stroke="#134074" strokeWidth="2.2" />
          <path
            d="M-13 -7 L-10.5 -4 L-5 -10.5"
            fill="none"
            stroke="#134074"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      );
    case 2: // Rules & Regulations — the 8-knot speed-limit roundel this module covers
      return (
        <g transform="translate(320,48)">
          <rect x="-1.5" y="10" width="3" height="18" fill="#334155" />
          <circle cx="0" cy="0" r="13" fill="white" stroke="#E11D48" strokeWidth="4" />
          <text x="0" y="4" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#134074">
            8
          </text>
        </g>
      );
    case 3: // Collision Avoidance — two boats passing. Fixed 21 October 2026:
    // this previously read translate(300,62), but Hull() already adds its
    // own translate(x,60) internally, so the whole group was landing at
    // y=122 — below the 100-tall viewBox, meaning the second boat has never
    // actually been visible on the live site. Dropping the y-offset to 2
    // (so 2+60=62, the position this was clearly meant to land at) brings
    // it back on screen.
      return (
        <g transform="translate(300,2)">
          <Hull x={0} />
          <g transform="translate(30,4) scale(0.8)">
            <Hull x={0} />
          </g>
        </g>
      );
    case 4: // Navigation Lights — a boat seen bow-on at night, showing its sidelights. Revised 21
    // October 2026 at Scott's request: the hull is a proper boat-shaped
    // cross-section now (flat gunwale, a small cabin, a rounded keel)
    // rather than the plain triangular wedge this used to be, and the
    // sidelights are swapped — facing an oncoming bow, the vessel's own
    // port (red) is on YOUR right and its starboard (green) is on YOUR
    // left, since you're looking at it from the front, not standing on it.
    // The earlier red-left/green-right version was correct only for a
    // stern view, where you can't actually see the sidelights at all.
      return (
        <g transform="translate(310,58)">
          <rect x="-6" y="-24" width="12" height="10" rx="1.5" fill="#134074" stroke="#5B82AC" strokeWidth="1" />
          <path
            d="M-15 -8 L15 -8 L11 10 Q0 16 -11 10 Z"
            fill="#15325A"
            stroke="#5B82AC"
            strokeWidth="1"
          />
          <circle cx="-11" cy="0" r="3" fill="#2BB673" />
          <circle cx="11" cy="0" r="3" fill="#E11D48" />
          <circle cx="0" cy="-22" r="2.2" fill="#F5F5F0" />
        </g>
      );
    case 5: // IALA Buoyage — the paired port (red can) and starboard (green cone) lateral marks
      return (
        <g transform="translate(300,58)">
          <rect x="-2" y="0" width="4" height="20" fill="#334155" />
          <rect x="-6" y="-14" width="12" height="14" rx="1" fill="#E11D48" />
          <g transform="translate(26,4)">
            <rect x="-2" y="0" width="4" height="16" fill="#334155" />
            <polygon points="-6,-10 6,-10 0,-20" fill="#2BB673" />
          </g>
        </g>
      );
    case 6: // Maintenance — a crossed wrench and hammer, single-colour silhouette
    // style like the reference image Scott sent 21 October 2026 (replacing
    // the earlier side-by-side wrench + brown-handled hammer).
      return (
        <g transform="translate(310,55)">
          <g transform="rotate(-40)">
            <path d="M-10 -10 a6 6 0 1 1 8 8 L10 10 L6 14 L-10 -2 Z" fill="#334155" />
          </g>
          <g transform="rotate(50)">
            <rect x="-2.5" y="-6" width="5" height="22" rx="1.5" fill="#334155" />
            <path d="M-9 -16 H9 V-8 H-9 Z M5 -16 H9 V-11 H7 Z" fill="#334155" fillRule="evenodd" />
          </g>
        </g>
      );
    case 7: // Safety Equipment — a life ring
      return (
        <g transform="translate(320,55)">
          <circle cx="0" cy="0" r="14" fill="none" stroke="#E11D48" strokeWidth="6" />
          <circle cx="0" cy="0" r="14" fill="none" stroke="white" strokeWidth="6" strokeDasharray="8 8" />
        </g>
      );
    case 8: // Safe Operations — a fuel drop, with a wave for weather and tides
      return (
        <g transform="translate(320,52)">
          <path d="M0 -14 C10 0 10 10 0 14 C-10 10 -10 0 0 -14 Z" fill="#2BB673" />
          <path d="M-22 20 Q-16 14 -10 20 T2 20" fill="none" stroke="#4EA5D9" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      );
    case 9: // Emergencies — a first aid cross (swapped from the storm-cloud-and-rain
    // icon, 21 October 2026 at Scott's request)
      return (
        <g transform="translate(320,55)">
          <rect x="-15" y="-15" width="30" height="30" rx="4" fill="#2BB673" />
          <rect x="-10" y="-3" width="20" height="6" rx="1" fill="white" />
          <rect x="-3" y="-10" width="6" height="20" rx="1" fill="white" />
        </g>
      );
    case 10: // Practical Assessment — a boat coming in to berth
      return (
        <g transform="translate(310,55)">
          <rect x="-20" y="0" width="6" height="20" fill="#8B5E3C" />
          <rect x="10" y="0" width="6" height="20" fill="#8B5E3C" />
          <rect x="-24" y="-4" width="44" height="6" fill="#A9764F" />
          <g transform="translate(-44,4)">
            <path d="M-10 0 Q0 4 10 0 L7 6 Q0 9 -7 6 Z" fill="#0B2545" />
            <rect x="-1.5" y="-8" width="3" height="8" fill="#134074" />
          </g>
        </g>
      );
    case 11: // Mock Assessment — an exam paper, with the passing checkmark
      return (
        <g transform="translate(305,52)">
          <rect x="-14" y="-16" width="24" height="30" rx="2" fill="white" stroke="#334155" strokeWidth="2" />
          <rect x="-7" y="-20" width="10" height="6" rx="1" fill="#334155" />
          <line x1="-9" y1="-6" x2="5" y2="-6" stroke="#CBD5E1" strokeWidth="1.5" />
          <line x1="-9" y1="0" x2="5" y2="0" stroke="#CBD5E1" strokeWidth="1.5" />
          <circle cx="18" cy="10" r="13" fill="#2BB673" />
          <path d="M12 10 L16 15 L25 3" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
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
    <HeroFrame accent={accent} night={moduleSortOrder === 4}>
      <Hull x={150} />
      <ModuleIcon moduleSortOrder={moduleSortOrder} />
    </HeroFrame>
  );
}
