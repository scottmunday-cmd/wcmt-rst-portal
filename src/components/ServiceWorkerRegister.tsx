"use client";

import { useEffect } from "react";

// Registers public/sw.js — required for the browser to treat this as an
// installable PWA (see src/app/manifest.ts for the rest of that). Split
// into its own tiny client component so the root layout itself can stay a
// Server Component.
export function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch((err) => {
        console.error("[pwa] service worker registration failed", err);
      });
    }
  }, []);

  return null;
}
