// Original diagram (not traced from any workbook or exam illustration) showing
// the classic "red to port, green to starboard, white astern" navigation
// light arcs from directly above the vessel. Built with a CSS conic-gradient
// rather than an image file, so it's crisp at any size and needs no assets.
export function NavigationLightArcs() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg bg-wcmt-bg p-5">
      <div className="relative h-52 w-52">
        <div
          className="h-full w-full rounded-full border-4 border-white shadow-inner"
          style={{
            backgroundImage:
              "conic-gradient(from 0deg, #2BB673 0deg 112.5deg, #E2E8F0 112.5deg 247.5deg, #E11D48 247.5deg 360deg)",
          }}
          aria-hidden="true"
        />
        {/* Boat silhouette pointing "up" (bow) */}
        <svg
          viewBox="0 0 100 100"
          className="pointer-events-none absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          <path
            d="M50 22 L64 62 Q50 72 36 62 Z"
            fill="#0B2545"
            stroke="white"
            strokeWidth="2"
          />
        </svg>
        <span className="absolute left-1/2 top-1 -translate-x-1/2 text-xs font-semibold text-wcmt-navy">
          Bow
        </span>
        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-xs font-semibold text-slate-500">
          Stern
        </span>
        <span className="absolute right-1 top-1/2 -translate-y-1/2 text-xs font-semibold text-wcmt-green">
          Starboard
        </span>
        <span className="absolute left-1 top-1/2 -translate-y-1/2 text-xs font-semibold text-red-600">
          Port
        </span>
      </div>
      <div className="grid grid-cols-3 gap-3 text-center text-xs text-slate-600">
        <div>
          <span className="inline-block h-3 w-3 rounded-sm bg-red-600 align-middle" />
          <p className="mt-1 font-medium text-wcmt-navy">Port sidelight</p>
          <p>Red — 112.5°</p>
        </div>
        <div>
          <span className="inline-block h-3 w-3 rounded-sm bg-slate-200 align-middle" />
          <p className="mt-1 font-medium text-wcmt-navy">Stern light</p>
          <p>White — 135°</p>
        </div>
        <div>
          <span className="inline-block h-3 w-3 rounded-sm bg-wcmt-green align-middle" />
          <p className="mt-1 font-medium text-wcmt-navy">Starboard sidelight</p>
          <p>Green — 112.5°</p>
        </div>
      </div>
      <p className="max-w-xs text-center text-xs text-slate-500">
        Looking straight down on the vessel from above, bow at the top. The masthead light (white,
        not shown here) shines over the same 225° forward arc as the two sidelights combined, just
        from a higher position — together with the stern light it covers the full 360°.
      </p>
    </div>
  );
}
