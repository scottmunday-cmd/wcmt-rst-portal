// Original one-glance recaps of each module — not copied from the workbook,
// just our own condensed version of what's already taught in the lessons.
// Built for the on-the-water quick-reference page, where a student wants the
// gist back in a few seconds rather than re-reading a whole lesson.

type ModuleSummary = {
  n: number;
  title: string;
  points: string[];
};

const SUMMARIES: ModuleSummary[] = [
  {
    n: 1,
    title: "Introduction",
    points: [
      "You need an RST to skipper a vessel with a motor over 6 hp (4.5 kW). Minimum age 14; 14–15 year olds are limited to daylight hours and 8 knots.",
      "Two assessments: a 40-question theory paper (34 to pass) then a ~30 minute practical (56 of 62 criteria).",
      "Bring ID + eyesight proof, a medical self-declaration, and — if under 18 — signed parental consent.",
    ],
  },
  {
    n: 2,
    title: "Rules & Regulations",
    points: [
      "You carry a duty of care for everyone on board and everyone else on the water. BAC limit is 0.05, same as driving.",
      "8 knots near jetties, moorings, shallow water, and within 50 m of another vessel or a person in the water.",
      "Report serious incidents within 72 hours. Most powered vessels need registration (small tenders are often exempt).",
    ],
  },
  {
    n: 3,
    title: "Collision Avoidance",
    points: [
      "You're always responsible for avoiding a collision — even when you technically have right of way.",
      "Overtaking vessel always keeps clear. Power gives way to sail. Head-on: both turn to starboard, pass port-to-port.",
      "Sound signals: 1 blast = altering to starboard, 2 = to port, 3 = going astern, 5 = \"I don't understand\" / danger.",
    ],
  },
  {
    n: 4,
    title: "Navigation Lights",
    points: [
      "Show lights sunset to sunrise, and in restricted visibility. Red sidelight = port, green = starboard.",
      "White masthead (forward) + stern light cover 360° between them — or one all-round white light on vessels under 12 m.",
      "Anchor light is all-round white. Use red light (not white) at the helm at night to protect your night vision.",
    ],
  },
  {
    n: 5,
    title: "IALA Buoyage",
    points: [
      "Port mark = red, can-shaped. Starboard mark = green, cone-shaped. Keep them on the matching side entering harbour/heading upstream.",
      "Cardinal marks: pass on the side named by the mark. Lit rhythm mimics a clock face — East = 3 flashes, South = 6 + one long flash, West = 9, North = continuous.",
      "Isolated danger mark: black with a red band, pass well clear on any side, Gp Fl (2) if lit. Safe water mark: red/white stripes, safe all around.",
    ],
  },
  {
    n: 6,
    title: "Maintenance",
    points: [
      "Service the motor at least yearly; change gearbox oil every 3 months if used hard.",
      "Run pre-trip, post-trip, monthly and yearly checks. Do a fuel \"sniff test\" before every start.",
      "Check the prop for wrapped fishing line regularly — it can destroy the gearbox seal.",
    ],
  },
  {
    n: 7,
    title: "Safety Equipment",
    points: [
      "Lifejackets: Level 100+ for registrable vessels, Level 50/50S for non-registrable vessels and PWCs. Check the wearing rules for kids and PWCs.",
      "Beyond 400 m from shore: carry 2 red + 2 orange hand flares (or an EVDS) plus a GPS-enabled EPIRB or PLB, registered with AMSA.",
      "Marine radio required beyond 4 nm. VHF Ch 16 = distress/calling. Mayday = grave danger, Pan Pan = urgent, Securite = safety warning.",
    ],
  },
  {
    n: 8,
    title: "Safe Operations",
    points: [
      "Fuel rule of thumb: 25% out, 25% back, 50% in reserve. Brief passengers and check for seasickness or medical issues.",
      "Keep weight low and centred for stability. A long, slow roll that won't return upright is a warning sign — not a simple list.",
      "Check the Bureau of Meteorology before you go: warnings, wind, swell and tides. Strong wind = 25–33 kn, gale = 34–47 kn, storm = 48 kn+.",
    ],
  },
  {
    n: 9,
    title: "Emergencies",
    points: [
      "Capsize: stay with the vessel, get everyone up onto the hull rather than staying in the water.",
      "Fire: raise the alarm, head count, cut fuel/gas, fight it with an extinguisher or blanket — keep watching after it's out.",
      "Cold water: HELP position alone, Huddle as a group. Rewarm gradually, no alcohol, get medical help.",
    ],
  },
  {
    n: 10,
    title: "Practical Assessment",
    points: [
      "About 30 minutes on the water. You need 56 of 62 criteria — unsafe skippering is an instant fail regardless of score.",
      "Covers a safety briefing, pre-start checks, logging a voyage plan, departure, a person-overboard recovery, a transit fix, a controlled stop, returning to berth, and logging off.",
    ],
  },
  {
    n: 11,
    title: "Mock Assessment",
    points: [
      "Full-length practice papers drawn from every module's question bank, similar in shape to the real assessment.",
      "Keep sitting them until you're consistently passing before assessment day.",
    ],
  },
];

export function ModuleSummaries() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {SUMMARIES.map((m) => (
        <div key={m.n} className="rounded-lg bg-wcmt-bg p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-wcmt-coastal">
            Module {m.n}
          </p>
          <h3 className="mt-0.5 font-heading text-sm font-semibold text-wcmt-navy">{m.title}</h3>
          <ul className="mt-2 space-y-1.5">
            {m.points.map((p, i) => (
              <li key={i} className="flex gap-1.5 text-[11px] leading-snug text-slate-600">
                <span className="text-wcmt-orange">&bull;</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
