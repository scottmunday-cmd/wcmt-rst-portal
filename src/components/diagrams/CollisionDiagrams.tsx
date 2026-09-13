// Original diagrams for the Collision Avoidance module — not traced from any
// workbook, exam paper or chart.

// Small triangular vessel icon, positioned and rotated by its parent <g>.
// Apex points "up" (bow forward) at rotate(0).
function Boat({ fill = "#0B2545" }: { fill?: string }) {
  return <polygon points="0,-11 8,10 0,5 -8,10" fill={fill} />;
}

// Shared arrowhead marker, one per colour so each path's arrow matches its
// stroke. `orient="auto"` means the arrow always points the true direction
// of travel, independent of how the boat icon itself is rotated.
function ArrowDefs({ id, color }: { id: string; color: string }) {
  return (
    <defs>
      <marker
        id={id}
        markerWidth="8"
        markerHeight="8"
        refX="6"
        refY="4"
        orient="auto-start-reverse"
      >
        <path d="M0,0 L8,4 L0,8 Z" fill={color} />
      </marker>
    </defs>
  );
}

const NAVY = "#0B2545";
const COASTAL = "#4EA5D9";

export function GiveWayDiagram() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {/* Head-on */}
      <div className="flex flex-col items-center gap-2 rounded-lg bg-wcmt-bg p-3 text-center">
        <svg viewBox="0 0 130 130" className="h-32 w-28" aria-hidden="true">
          <ArrowDefs id="gw-ho-navy" color={NAVY} />
          <ArrowDefs id="gw-ho-coastal" color={COASTAL} />
          <line x1="65" y1="122" x2="65" y2="8" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="3 4" />
          {/* Navy vessel: heading up, alters to starboard (image-right) */}
          <path
            d="M65,122 Q95,95 95,20"
            fill="none"
            stroke={NAVY}
            strokeWidth="3"
            markerEnd="url(#gw-ho-navy)"
          />
          <g transform="translate(65,122)">
            <Boat fill={NAVY} />
          </g>
          {/* Coastal vessel: heading down, alters to starboard (image-left) */}
          <path
            d="M65,8 Q35,35 35,110"
            fill="none"
            stroke={COASTAL}
            strokeWidth="3"
            markerEnd="url(#gw-ho-coastal)"
          />
          <g transform="translate(65,8) rotate(180)">
            <Boat fill={COASTAL} />
          </g>
        </svg>
        <p className="text-xs font-semibold text-wcmt-navy">Head-on</p>
        <p className="text-[11px] leading-snug text-slate-500">
          Meeting head-on, both vessels turn to starboard (the right) — like sticking to your own
          side of the road — and pass port-to-port.
        </p>
      </div>

      {/* Crossing */}
      <div className="flex flex-col items-center gap-2 rounded-lg bg-wcmt-bg p-3 text-center">
        <svg viewBox="0 0 150 130" className="h-32 w-32" aria-hidden="true">
          <ArrowDefs id="gw-cr-navy" color={NAVY} />
          <ArrowDefs id="gw-cr-coastal" color={COASTAL} />
          {/* Faint original heading the coastal vessel gives up on, to avoid crossing ahead */}
          <line x1="18" y1="105" x2="112" y2="18" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="3 4" />
          {/* Navy = stand-on vessel: holds course and speed, crosses ahead uninterrupted */}
          <path
            d="M140,18 L20,95"
            fill="none"
            stroke={NAVY}
            strokeWidth="3"
            markerEnd="url(#gw-cr-navy)"
          />
          <g transform="translate(140,18) rotate(-125)">
            <Boat fill={NAVY} />
          </g>
          {/* Coastal = give-way vessel: turns to starboard, slows, passes astern (behind) */}
          <path
            d="M18,105 Q70,122 128,72"
            fill="none"
            stroke={COASTAL}
            strokeWidth="3"
            markerEnd="url(#gw-cr-coastal)"
          />
          <g transform="translate(18,105) rotate(48)">
            <Boat fill={COASTAL} />
          </g>
        </svg>
        <p className="text-xs font-semibold text-wcmt-navy">Crossing</p>
        <p className="text-[11px] leading-snug text-slate-500">
          The vessel on your starboard (light blue here) has right of way. You (light blue)
          turn to starboard and ease off, letting the darker vessel come through ahead of you —
          never cut across its bow.
        </p>
      </div>

      {/* Overtaking */}
      <div className="flex flex-col items-center gap-2 rounded-lg bg-wcmt-bg p-3 text-center">
        <svg viewBox="0 0 130 130" className="h-32 w-28" aria-hidden="true">
          <ArrowDefs id="gw-ot-coastal" color={COASTAL} />
          <ArrowDefs id="gw-ot-navy" color={NAVY} />
          {/* Coastal = vessel ahead: holds course and speed */}
          <path
            d="M68,118 L68,15"
            fill="none"
            stroke={COASTAL}
            strokeWidth="3"
            markerEnd="url(#gw-ot-coastal)"
          />
          <g transform="translate(68,118)">
            <Boat fill={COASTAL} />
          </g>
          {/* Navy = overtaking vessel: swings wide, keeps well clear, passes */}
          <path
            d="M50,125 Q6,68 42,18"
            fill="none"
            stroke={NAVY}
            strokeWidth="3"
            markerEnd="url(#gw-ot-navy)"
          />
          <g transform="translate(50,125) rotate(-25)">
            <Boat fill={NAVY} />
          </g>
        </svg>
        <p className="text-xs font-semibold text-wcmt-navy">Overtaking</p>
        <p className="text-[11px] leading-snug text-slate-500">
          The overtaking vessel (dark) keeps well clear on either side, whatever the situation —
          the vessel ahead just holds its course and speed.
        </p>
      </div>
    </div>
  );
}

const SOUND_SIGNALS = [
  { blasts: 1, meaning: "Altering course to starboard (right)" },
  { blasts: 2, meaning: "Altering course to port (left)" },
  { blasts: 3, meaning: "Operating astern propulsion" },
  { blasts: 5, meaning: "I don't understand — or you're not following the rules" },
];

export function SoundSignalDiagram() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {SOUND_SIGNALS.map((s) => (
        <div key={s.blasts} className="flex items-center gap-3 rounded-lg bg-wcmt-bg p-3">
          <div className="flex shrink-0 gap-0.5">
            {Array.from({ length: s.blasts }).map((_, i) => (
              <span key={i} className="h-6 w-2 rounded-sm bg-wcmt-orange" />
            ))}
          </div>
          <div>
            <p className="text-xs font-semibold text-wcmt-navy">
              {s.blasts} short blast{s.blasts > 1 ? "s" : ""}
            </p>
            <p className="text-[11px] leading-snug text-slate-500">{s.meaning}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
