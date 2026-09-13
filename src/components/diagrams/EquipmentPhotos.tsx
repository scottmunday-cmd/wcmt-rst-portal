import Image from "next/image";

// Real photos of safety equipment, to soften the look of this module
// alongside the original illustrations used elsewhere. Sourced from
// Wikimedia Commons under Creative Commons licences that permit reuse —
// each is attributed here as its licence requires. None of these come from
// the WA workbook (which restricts commercial reuse of its own photos).
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
  credit: Credit;
}) {
  return (
    <figure className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <Image src={src} alt={alt} width={width} height={height} className="h-40 w-full object-cover" />
      <figcaption className="p-2 text-center">
        <p className="text-[11px] font-semibold text-wcmt-navy">{caption}</p>
        <p className="mt-0.5 text-[9px] text-slate-400">
          Photo:{" "}
          <a href={credit.url} target="_blank" rel="noopener noreferrer" className="underline">
            {credit.author}
          </a>
          , {credit.license} (Wikimedia Commons)
        </p>
      </figcaption>
    </figure>
  );
}

export function LifejacketPhotoRow() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <Photo
        src="/equipment/lifejacket-generic.jpg"
        alt="An orange foam lifejacket"
        width={499}
        height={733}
        caption="A foam lifejacket — the general style required on registrable vessels"
        credit={{
          title: "Universal Life Jacket.JPG",
          author: "Wikimedia Commons contributor",
          license: "CC BY-SA 3.0",
          url: "https://commons.wikimedia.org/wiki/File:Universal_Life_Jacket.JPG",
        }}
      />
      <Photo
        src="/equipment/epirb.jpg"
        alt="An EPIRB distress beacon"
        width={960}
        height={640}
        caption="An EPIRB — lift the antenna and press the button to activate"
        credit={{
          title: "EPIRB (3).jpg",
          author: "Marwan Mohamad",
          license: "CC BY-SA 4.0",
          url: "https://commons.wikimedia.org/wiki/File:EPIRB_(3).jpg",
        }}
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

export function FireExtinguisherPhoto() {
  return (
    <Photo
      src="/equipment/fire-extinguisher.jpg"
      alt="A fire extinguisher mounted on a boat"
      width={500}
      height={750}
      caption="A fire extinguisher mounted within easy reach — part of the recommended additional gear"
      credit={{
        title: "Fire extinguisher on a boat.jpg",
        author: "Kritzolina",
        license: "CC BY-SA 4.0",
        url: "https://commons.wikimedia.org/wiki/File:Fire_extinguisher_on_a_boat.jpg",
      }}
    />
  );
}
