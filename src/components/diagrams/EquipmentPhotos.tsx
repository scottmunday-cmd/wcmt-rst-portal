import Image from "next/image";

// Real photos of safety equipment, to soften the look of this module
// alongside the original illustrations used elsewhere. Most are sourced
// from Wikimedia Commons under Creative Commons licences that permit
// reuse — each of those is attributed here as its licence requires. The
// fire extinguisher, EPIRB and lifejacket-types photos are the exception:
// Scott supplied these directly (24 September 2026) rather than sourcing
// them from Commons, so they carry no licence to credit — see the note on
// `credit` below. None of these come from the WA workbook (which
// restricts commercial reuse of its own photos).
type Credit = { title: string; author: string; license: string; url: string };

function Photo({
  src,
  alt,
  width,
  height,
  caption,
  credit,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption: string;
  // Optional: the Wikimedia-sourced photos in this file all need the
  // licence/attribution line below, but the photos Scott supplied directly
  // (fire extinguisher, EPIRB, lifejacket-types — see the file header)
  // don't come with a Commons licence to credit, so they omit this
  // entirely.
  credit?: Credit;
}) {
  return (
    <figure className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <Image src={src} alt={alt} width={width} height={height} className="h-40 w-full object-cover" />
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

// Requested by Scott 24 September 2026: the single-lifejacket photo that
// used to sit here moved out to its own full-width spot below
// (LifejacketTypesPhoto) — its replacement, a wide four-up comparison
// image, doesn't suit a half-width grid slot — and the fire extinguisher
// photo moved in here alongside the EPIRB instead. Kept the name
// SafetyGearPhotoRow (rather than LifejacketPhotoRow) since it's no longer
// lifejacket-specific.
export function SafetyGearPhotoRow() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <Photo
        src="/equipment/fire-extinguisher.jpg"
        alt="A dry chemical fire extinguisher with mounting bracket"
        width={504}
        height={607}
        caption="A dry chemical fire extinguisher — part of the recommended additional gear, with a bracket for secure mounting"
      />
      <Photo
        src="/equipment/epirb.jpg"
        alt="An EPIRB distress beacon"
        width={421}
        height={588}
        caption="An EPIRB — lift the antenna and press the button to activate"
      />
    </div>
  );
}

// Wide four-up illustration comparing lifejacket types (foam vest,
// inflatable collar, high-vis foam vest, inflatable harness) — replaces
// the single generic lifejacket photo that used to live in the row above.
// Scott supplied this image directly, so — like the fire extinguisher and
// EPIRB photos — it carries no Commons licence to credit.
export function LifejacketTypesPhoto() {
  return (
    <Photo
      src="/equipment/lifejacket-types.jpg"
      alt="Four types of lifejacket: a foam vest, an inflatable collar, a high-visibility foam vest, and an inflatable harness"
      width={1208}
      height={351}
      caption="Types of life jackets on registrable vessels"
    />
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
