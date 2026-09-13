// Original diagrams for the Collision Avoidance module — redrawn from
// scratch (own hull shape, own colours, own layout), not traced from the
// workbook. The boat icon's bow is split red/green to show each vessel's
// own port/starboard sidelights, and vessels are labelled A/B the way a
// skipper would talk through a give-way situation with a student.

// Hull points "up" (bow forward) at rotate(0). The bow wedge is split
// red (port, its own left) / green (starboard, its own right) — this stays
// correct under rotation, exactly like a vessel's actual sidelights do.
function Boat() {
  return (
    <g stroke="#0B2545" strokeWidth="1" strokeLinejoin="round">
      <polygon points="0,-15 -7,-3 7,-3" fill="none" />
      <polygon points="0,-15 -7,-3 0,-3" fill="#E11D48" />
      <polygon points="0,-15 7,-3 0,-3" fill="#2BB673" />
      <polygon points="-7,-3 7,-3 6,10 -6,10" fill="#FFFFFF" />
    </g>
  );
}

function Label({ x, y, text }: { x: number; y: number; text: string }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x={-9} y={-9} width={18} height={16} rx={2} fill="#FFFFFF" stroke="#0B2545" strokeWidth="1" />
      <text x={0} y={3} textAnchor="middle" fontSize="11" fontWeight="700" fill="#0B2545">
        {text}
      </text>
    </g>
  );
}

function ArrowDefs({ id }: { id: string }) {
  return (
    <marker id={id} markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto-start-reverse">
      <path d="M0,0 L7,3.5 L0,7 Z" fill="#0B2545" />
    </marker>
  );
}

export function GiveWayDiagram() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {/* Head-on */}
      <div className="flex flex-col items-center gap-2 rounded-lg bg-wcmt-bg p-3 text-center">
        <svg viewBox="0 0 140 130" className="h-32 w-32" aria-hidden="true">
          <defs>
            <ArrowDefs id="gw-ho" />
          </defs>
          <line x1="70" y1="122" x2="70" y2="8" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="3 4" />
          <path d="M70,115 Q95,80 95,20" fill="none" stroke="#0B2545" strokeWidth="2" markerEnd="url(#gw-ho)" />
          <path d="M70,15 Q45,50 45,110" fill="none" stroke="#0B2545" strokeWidth="2" markerEnd="url(#gw-ho)" />
          <g transform="translate(70,115)">
            <Boat />
          </g>
          <g transform="translate(70,15) rotate(180)">
            <Boat />
          </g>
          <Label x={70} y={126} text="A" />
          <Label x={70} y={5} text="B" />
        </svg>
        <p className="text-xs font-semibold text-wcmt-navy">Head-on</p>
        <p className="text-[11px] italic leading-snug text-slate-600">
          Both vessels alter course to starboard.
        </p>
      </div>

      {/* Crossing */}
      <div className="flex flex-col items-center gap-2 rounded-lg bg-wcmt-bg p-3 text-center">
        <svg viewBox="0 0 150 130" className="h-32 w-32" aria-hidden="true">
          <defs>
            <ArrowDefs id="gw-cr" />
          </defs>
          <line x1="18" y1="105" x2="112" y2="18" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="3 4" />
          <path d="M140,18 L20,95" fill="none" stroke="#0B2545" strokeWidth="2" markerEnd="url(#gw-cr)" />
          <path d="M18,105 Q70,122 128,72" fill="none" stroke="#0B2545" strokeWidth="2" markerEnd="url(#gw-cr)" />
          <g transform="translate(140,18) rotate(-125)">
            <Boat />
          </g>
          <g transform="translate(18,105) rotate(48)">
            <Boat />
          </g>
          <Label x={148} y={6} text="B" />
          <Label x={8} y={117} text="A" />
        </svg>
        <p className="text-xs font-semibold text-wcmt-navy">Crossing</p>
        <p className="text-[11px] italic leading-snug text-slate-600">
          A gives way to B — turns to starboard, passes astern.
        </p>
      </div>

      {/* Overtaking */}
      <div className="flex flex-col items-center gap-2 rounded-lg bg-wcmt-bg p-3 text-center">
        <svg viewBox="0 0 130 130" className="h-32 w-32" aria-hidden="true">
          <defs>
            <ArrowDefs id="gw-ot" />
          </defs>
          <path d="M68,118 L68,15" fill="none" stroke="#0B2545" strokeWidth="2" markerEnd="url(#gw-ot)" />
          <path d="M50,125 Q6,68 42,18" fill="none" stroke="#0B2545" strokeWidth="2" markerEnd="url(#gw-ot)" />
          <g transform="translate(68,118)">
            <Boat />
          </g>
          <g transform="translate(50,125) rotate(-25)">
            <Boat />
          </g>
          <Label x={80} y={110} text="B" />
          <Label x={38} y={125} text="A" />
        </svg>
        <p className="text-xs font-semibold text-wcmt-navy">Overtaking</p>
        <p className="text-[11px] italic leading-snug text-slate-600">
          A keeps clear of B, on either side, whatever the situation.
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
