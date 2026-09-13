// Original recreation of the WA safety-equipment carriage/wearing
// requirements — the regulatory facts themselves aren't anyone's property,
// but the artwork is redrawn from scratch here (own icons, own layout, own
// colours) rather than lifted from the workbook, which restricts commercial
// reuse of its own images and text.

type Requirement = "required" | "recommended" | "notRequired" | "na";

type Row = {
  title: string;
  sub?: string;
  detail: string;
  cells: [Requirement, Requirement, Requirement, Requirement];
  note?: [string?, string?, string?, string?];
};

const ROWS: Row[] = [
  {
    title: "Recreational Skipper's Ticket",
    detail: "Required to skipper a vessel powered by a motor greater than 6 horsepower.",
    cells: ["required", "notRequired", "required", "notRequired"],
  },
  {
    title: "Lifejacket carriage",
    sub: "Vessels smaller than 4.8 m",
    detail: "A lifejacket must be carried for every person on board.",
    cells: ["required", "recommended", "required", "required"],
    note: ["Min. Level 100 — must be carried", undefined, "Min. Level 100 — must be worn", "Min. Level 50S — must be worn"],
  },
  {
    title: "Lifejacket carriage",
    sub: "Vessels 4.8 m and larger",
    detail: "A lifejacket must be carried for every person on board.",
    cells: ["required", "recommended", "required", "required"],
    note: [
      "Min. Level 100 — must be carried",
      undefined,
      "Min. Level 100 — must be carried",
      "Min. Level 50S — must be carried",
    ],
  },
  {
    title: "Lifejacket wearing",
    sub: "Children older than 1, younger than 12",
    detail: "Wearing (not just carrying) is required in specific situations.",
    cells: ["required", "recommended", "required", "required"],
    note: ["Min. Level 100 — must be carried", undefined, "Min. Level 100 — must be worn", "Min. Level 50S — must be worn"],
  },
  {
    title: "Lifejacket wearing",
    sub: "Personal watercraft (PWC)",
    detail: "Wearing (not just carrying) is required in specific situations.",
    cells: ["required", "na", "required", "na"],
    note: ["Min. Level 50S — must be worn", undefined, "Min. Level 50S — must be worn", undefined],
  },
  {
    title: "Distress beacon (in-date)",
    detail: "A GPS-enabled 406 MHz EPIRB, or a GPS-enabled PLB if worn by at least one person. Must be registered with AMSA.",
    cells: ["recommended", "recommended", "required", "required"],
  },
  {
    title: "Red & orange flares (in-date), or EVDS",
    detail: "At least two hand-held red flares and two hand-held orange flares — or an EVDS carried in lieu, if a GPS-enabled EPIRB or PLB is also carried.",
    cells: ["recommended", "recommended", "required", "required"],
  },
  {
    title: "Marine radio",
    detail: "A VHF or HF marine radio on any registrable vessel operating more than 4 nautical miles from shore in unprotected waters.",
    cells: ["recommended", "recommended", "required", "recommended"],
    note: [undefined, undefined, "Required beyond 4nm — recommended within 4nm", undefined],
  },
  {
    title: "Recommended additional equipment",
    detail: "An anchor and line, a fire extinguisher, and a means of removing water.",
    cells: ["recommended", "recommended", "recommended", "recommended"],
  },
];

const COLUMNS = [
  { water: "Protected waters", fleet: "Registrable" },
  { water: "Protected waters", fleet: "Non-registrable" },
  { water: "Unprotected waters", fleet: "Registrable" },
  { water: "Unprotected waters", fleet: "Non-registrable" },
] as const;

function Cell({ value, note }: { value: Requirement; note?: string }) {
  if (value === "required") {
    return (
      <div className="flex flex-col items-center gap-0.5 text-center">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-wcmt-green text-[11px] font-bold text-white">
          ✓
        </span>
        {note && <span className="text-[10px] font-semibold leading-tight text-wcmt-navy">{note}</span>}
      </div>
    );
  }
  if (value === "recommended") {
    return <span className="text-[10px] font-semibold uppercase tracking-wide text-wcmt-coastal">Recommended</span>;
  }
  if (value === "notRequired") {
    return <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Not required</span>;
  }
  return <span className="text-slate-300">—</span>;
}

export function SafetyRequirementsTable() {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 gap-2 text-[11px] text-slate-600 sm:grid-cols-2">
        <p>
          <span className="font-semibold text-wcmt-navy">Registrable vessel:</span> any vessel,
          including sailing vessels, that is or can be propelled by mechanical power.
        </p>
        <p>
          <span className="font-semibold text-wcmt-orange">Non-registrable vessel:</span> tenders
          and sailing dinghies.
        </p>
        <p className="sm:col-span-2">
          <span className="font-semibold text-wcmt-navy">Protected waters</span> — rivers, lakes,
          estuaries, harbours, and within 400 m of shore in unprotected waters.{" "}
          <span className="font-semibold text-wcmt-orange">Unprotected waters</span> — beyond 400
          m from shore.
        </p>
      </div>
      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full min-w-[640px] border-collapse text-xs">
          <thead>
            <tr>
              <th rowSpan={2} className="border-b border-r border-slate-200 bg-wcmt-bg p-2 text-left align-bottom text-wcmt-navy">
                Requirement
              </th>
              <th colSpan={2} className="border-b border-slate-200 bg-wcmt-navy p-2 text-center font-semibold text-white">
                Protected waters
              </th>
              <th colSpan={2} className="border-b border-l border-slate-200 bg-wcmt-orange p-2 text-center font-semibold text-white">
                Unprotected waters
              </th>
            </tr>
            <tr>
              {COLUMNS.map((c, i) => (
                <th
                  key={i}
                  className={
                    "border-b border-slate-200 p-2 text-center font-medium text-white " +
                    (i < 2 ? "bg-wcmt-ocean" : "bg-[#c9572a]") +
                    (i === 2 ? " border-l" : "")
                  }
                >
                  {c.fleet}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-wcmt-bg"}>
                <td className="border-r border-slate-200 p-2 align-top">
                  <p className="font-semibold text-wcmt-navy">{row.title}</p>
                  {row.sub && <p className="text-[10px] font-medium text-slate-500">{row.sub}</p>}
                  <p className="mt-0.5 text-[10px] leading-snug text-slate-500">{row.detail}</p>
                </td>
                {row.cells.map((cell, j) => (
                  <td key={j} className={"p-2 text-center align-middle" + (j === 2 ? " border-l border-slate-200" : "")}>
                    <Cell value={cell} note={row.note?.[j]} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
