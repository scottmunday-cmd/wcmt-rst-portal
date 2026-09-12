// Original diagrams for the Collision Avoidance module — not traced from any
// workbook, exam paper or chart.

function BoatIcon({ fill = "#0B2545" }: { fill?: string }) {
  return (
    <svg viewBox="0 0 30 40" className="h-10 w-8" aria-hidden="true">
      <polygon points="15,0 26,28 15,22 4,28" fill={fill} />
    </svg>
  );
}

export function GiveWayDiagram() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <div className="flex flex-col items-center gap-2 rounded-lg bg-wcmt-bg p-3 text-center">
        <div className="flex items-center justify-center gap-1">
          <div className="rotate-180">
            <BoatIcon />
          </div>
          <BoatIcon fill="#4EA5D9" />
        </div>
        <p className="text-xs font-semibold text-wcmt-navy">Head-on</p>
        <p className="text-[11px] leading-snug text-slate-500">
          Both vessels alter course to the right, and pass port-to-port.
        </p>
      </div>
      <div className="flex flex-col items-center gap-2 rounded-lg bg-wcmt-bg p-3 text-center">
        <div className="relative flex h-10 w-16 items-center justify-center">
          <div className="absolute left-0">
            <BoatIcon fill="#4EA5D9" />
          </div>
          <div className="absolute right-0 top-1 rotate-[-90deg]">
            <BoatIcon />
          </div>
        </div>
        <p className="text-xs font-semibold text-wcmt-navy">Crossing</p>
        <p className="text-[11px] leading-snug text-slate-500">
          The vessel on your starboard (right) side has right of way — you keep clear.
        </p>
      </div>
      <div className="flex flex-col items-center gap-2 rounded-lg bg-wcmt-bg p-3 text-center">
        <div className="flex flex-col items-center gap-1">
          <BoatIcon fill="#4EA5D9" />
          <div className="-mt-2">
            <BoatIcon />
          </div>
        </div>
        <p className="text-xs font-semibold text-wcmt-navy">Overtaking</p>
        <p className="text-[11px] leading-snug text-slate-500">
          The overtaking vessel keeps well clear, on either side, whatever the situation.
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
