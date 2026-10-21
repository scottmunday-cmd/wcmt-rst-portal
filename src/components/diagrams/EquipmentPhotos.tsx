import Image from "next/image";

// Real photos of safety equipment, to soften the look of this module
// alongside the original illustrations used elsewhere. Most are sourced
// from Wikimedia Commons under Creative Commons licences that permit
// reuse — each of those is attributed here as its licence requires. The
// fire extinguisher, EPIRB and lifejacket photos are the exception: Scott
// supplied these directly (24 September and 20 October 2026) rather than
// sourcing them from Commons, so they carry no licence to credit — see the
// note on `credit` below. None of these come from the WA workbook (which
// restricts commercial reuse of its own photos).
type Credit = { title: string; author: string; license: string; url: string };

function Photo({
  src,
  alt,
  width,
  height,
  caption,
  credit,
  fit = "cover",
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption: string;
  // Optional: the Wikimedia-sourced photos in this file all need the
  // licence/attribution line below, but the photos Scott supplied directly
  // (fire extinguisher, EPIRB, lifejacket photos — see the file header)
  // don't come with a Commons licence to credit, so they omit this
  // entirely.
  credit?: Credit;
  // "cover" (default) fills a short fixed-height box and crops — fine for
  // landscape photos. "contain" is for tall/portrait photos (the fire
  // extinguisher, EPIRB and the two real lifejacket photos): it shows the
  // whole photo inside a taller box instead of cropping the top and
  // bottom off, at the cost of a little letterboxing on some aspect
  // ratios. Capped at a smaller max-width (added 20 October 2026, at
  // Scott's request) so these taller cards don't stretch the page —
  // height scales down along with the capped width.
  fit?: "cover" | "contain";
}) {
  return (
    <figure
      className={
        "overflow-hidden rounded-lg border border-slate-200 bg-white" +
        (fit === "contain" ? " mx-auto w-full max-w-[160px]" : "")
      }
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={fit === "contain" ? "aspect-[3/4] w-full object-contain p-2" : "h-40 w-full object-cover"}
      />
      <figcaption className="p-2 text-center">
        <p className="text-[11px] font-semibold text-wcmt-navy">{caption}</p>
        {credit && (
          <p className="mt-0.5 text-[9px] text-slate-400">
            Photo:{" "}
            <a href={credit.url} target="_blank" rel="noopener noreferrer" className="underline">
              {credit.author}
            </a>
            , {credit.license} (Wikimedia Commons)
          </p>
        )}
      </figcaption>
    </figure>
  );
}

// Combined into a single row 20 October 2026 at Scott's request — the two
// real lifejacket photos on the left, the fire extinguisher and EPIRB on
// the right — replacing what used to be two separate stacked rows
// (LifejacketTypesPhoto above SafetyGearPhotoRow). Kept the export name
// SafetyGearPhotoRow so the module page only needed its second call
// (LifejacketTypesPhoto) removed, not re-pointed. All four use
// fit="contain" (added 20 October 2026): they're tall, narrow portrait
// shots, and the previous fixed h-40 + object-cover box was cropping most
// of each photo away, leaving only a cramped middle band visible. On
// narrow screens this still falls back to two rows of two (lifejackets,
// then gear), rather than squeezing four photos across a phone-width
// screen.
export function SafetyGearPhotoRow() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <Photo
        src="/equipment/lifejacket-inflatable.jpg"
        alt="A grey automatic inflatable lifejacket, ISO 150N rated"
        width={480}
        height={640}
        caption="An automatic inflatable lifejacket (ISO 150N) — compact to wear, and inflates on its own if you go in the water"
        fit="contain"
      />
      <Photo
        src="/equipment/lifejacket-solas.jpg"
        alt="An orange SOLAS-approved foam lifejacket"
        width={407}
        height={578}
        caption="A SOLAS-approved foam lifejacket, the type carried on larger vessels"
        fit="contain"
      />
      <Photo
        src="/equipment/fire-extinguisher.jpg"
        alt="A dry chemical fire extinguisher with mounting bracket"
        width={504}
        height={607}
        caption="A dry chemical fire extinguisher — part of the recommended additional gear, with a bracket for secure mounting"
        fit="contain"
      />
      <Photo
        src="/equipment/epirb.jpg"
        alt="An EPIRB distress beacon"
        width={421}
        height={588}
        caption="An EPIRB — lift the antenna and press the button to activate"
        fit="contain"
      />
    </div>
  );
}

export function FlaresPhotoRow() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <Photo
        src="/equipment/pyrotechnics-set.jpg"
        alt="An orange smoke canister, a red parachute rocket flare, and a red hand flare"
        width={960}
        height={720}
        caption="Orange smoke, a red parachute rocket, and a red hand flare — the classic SOLAS set"
        credit={{
          title: "Lifeboat pyrotechnics.jpg",
          author: "Christopher Doyle",
          license: "CC BY-SA 3.0",
          url: "https://commons.wikimedia.org/wiki/File:Lifeboat_pyrotechnics.jpg",
        }}
      />
      <Photo
        src="/equipment/flare-red.jpg"
        alt="A red hand-held flare and its spent casing"
        width={960}
        height={640}
        caption="A red hand-held flare, shown here with its spent case"
        credit={{
          title: "Distress flare mg 6522.jpg",
          author: "Rama",
          license: "CC BY-SA 2.0 FR",
          url: "https://commons.wikimedia.org/wiki/File:Distress_flare_mg_6522.jpg",
        }}
      />
    </div>
  );
}
