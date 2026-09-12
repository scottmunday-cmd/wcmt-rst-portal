// Original diagrams for the Emergencies module — not traced from any
// workbook, exam paper or chart.

export function CapsizeResponseDiagram() {
  const steps = [
    { label: "Stay with the vessel", detail: "It's far easier to spot than a person alone in the water." },
    { label: "Climb onto the hull", detail: "If you can't right and bail it, get everyone up out of the water." },
    { label: "Signal for help", detail: "Send a Mayday and activate your EPIRB before the vessel goes down." },
  ];
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {steps.map((s, i) => (
        <div key={s.label} className="flex flex-col items-center gap-2 rounded-lg bg-wcmt-bg p-3 text-center">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-wcmt-navy text-sm font-bold text-white">
            {i + 1}
          </span>
          <p className="text-xs font-semibold text-wcmt-navy">{s.label}</p>
          <p className="text-[11px] leading-snug text-slate-500">{s.detail}</p>
        </div>
      ))}
    </div>
  );
}

function PersonIcon({ curled }: { curled: boolean }) {
  return (
    <svg viewBox="0 0 30 30" className="h-10 w-10" aria-hidden="true">
      <circle cx="15" cy="7" r="4" fill="#F26B38" />
      {curled ? (
        <path d="M15 11 Q8 16 10 24 Q15 20 20 24 Q22 16 15 11 Z" fill="#134074" />
      ) : (
        <path d="M15 11 L15 24 M15 15 L6 22 M15 15 L24 22 M15 24 L9 29 M15 24 L21 29" stroke="#134074" strokeWidth="2.5" fill="none" />
      )}
    </svg>
  );
}

export function HelpHuddleDiagram() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div className="flex flex-col items-center gap-2 rounded-lg bg-wcmt-bg p-3 text-center">
        <PersonIcon curled />
        <p className="text-xs font-semibold text-wcmt-navy">HELP position</p>
        <p className="text-[11px] leading-snug text-slate-500">
          Alone: draw your legs up and arms in tight to your chest to conserve body heat.
        </p>
      </div>
      <div className="flex flex-col items-center gap-2 rounded-lg bg-wcmt-bg p-3 text-center">
        <div className="flex gap-1">
          <PersonIcon curled />
          <PersonIcon curled />
          <PersonIcon curled />
        </div>
        <p className="text-xs font-semibold text-wcmt-navy">Huddle position</p>
        <p className="text-[11px] leading-snug text-slate-500">
          In a group: cluster together chest to chest, arms around each other.
        </p>
      </div>
    </div>
  );
}
