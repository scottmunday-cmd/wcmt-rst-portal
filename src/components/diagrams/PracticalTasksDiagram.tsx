// Original diagram for the Practical Assessment module — not traced from any
// workbook, exam paper or chart.

import Image from "next/image";

// Real photos Scott supplied directly (21 October 2026) of students on
// assessment day, certificate in hand — no Commons licence to credit, same
// as the equipment photos in EquipmentPhotos.tsx.
export function AssessmentPassPhotos() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <figure className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <Image
          src="/practical/assessment-pass-1.jpg"
          alt="Two newly certified skippers holding their Recreational Skipper's Ticket certificates on board a boat at the marina"
          width={900}
          height={890}
          className="h-40 w-full object-cover"
        />
        <figcaption className="p-2 text-center">
          <p className="text-[11px] font-semibold text-wcmt-navy">
            Fresh off the water — certificate in hand straight after passing
          </p>
        </figcaption>
      </figure>
      <figure className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <Image
          src="/practical/assessment-pass-2.jpg"
          alt="A newly certified skipper holding his certificate aboard his own boat at the marina"
          width={1000}
          height={828}
          className="h-40 w-full object-cover"
        />
        <figcaption className="p-2 text-center">
          <p className="text-[11px] font-semibold text-wcmt-navy">
            Certified and ready to skipper your own boat
          </p>
        </figcaption>
      </figure>
    </div>
  );
}

const TASKS = [
  "Operate safely (continuous)",
  "Check lines & secure vessel",
  "Safety briefing",
  "Pre-start checks & start motor",
  "Log a voyage plan",
  "Depart berth safely",
  "Recover a person overboard",
  "Hold a course on a transit",
  "Controlled stop within 2 boat lengths",
  "Return to berth & secure",
  "Log off, trip complete",
];

export function PracticalTasksDiagram() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {TASKS.map((task, i) => (
        <div key={task} className="flex items-start gap-2 rounded-lg bg-wcmt-bg p-2.5">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-wcmt-navy text-[10px] font-bold text-white">
            {i + 1}
          </span>
          <p className="text-[11px] leading-snug text-slate-600">{task}</p>
        </div>
      ))}
    </div>
  );
}
