import type { MetadataRoute } from "next";

// Next.js's file-convention manifest — this alone makes the site
// installable (the browser's own "Install app" / "Add to Home Screen"
// prompt uses it), serving it at /manifest.webmanifest and wiring the
// <link rel="manifest"> tag automatically. Added 18 September 2026 so
// students get a proper full-screen app icon instead of a browser-chrome
// bookmark shortcut — see also apple-touch-icon.png (iOS reads that
// separately, not from this manifest) and public/sw.js (the service
// worker a PWA install also requires).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "West Coast Marine Training",
    short_name: "WCMT",
    description:
      "WA Recreational Skipper's Ticket training, assessment booking, and lifetime reference library.",
    // Straight into the student portal rather than the marketing homepage —
    // this is what opens when a student taps the icon they installed.
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#F5F7FA", // wcmt-bg
    theme_color: "#0B2545", // wcmt-navy
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
