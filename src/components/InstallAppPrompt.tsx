"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

// Chrome/Edge/Android fire this before showing their own install UI;
// calling preventDefault() lets us show our own button instead and trigger
// their native prompt from it. Not in lib.dom.d.ts yet, hence the manual type.
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISSED_KEY = "wcmt-install-prompt-dismissed";

/**
 * Nudges students to install the site as an app (see src/app/manifest.ts,
 * public/sw.js — added 18 September 2026) rather than just browsing it in
 * the mobile browser. Two different browsers, two different stories:
 *   - Android/Chrome/Edge fire `beforeinstallprompt`, which we can hook a
 *     real "Install App" button up to.
 *   - iOS Safari has no such event at all — there's no programmatic way to
 *     trigger "Add to Home Screen" there, so it's just written steps.
 * Hidden entirely once actually installed (display-mode: standalone), and
 * dismissible — remembered in localStorage so it doesn't nag every visit.
 */
export function InstallAppPrompt() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(true);
  const [isIos, setIsIos] = useState(false);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    const nav = window.navigator as Navigator & { standalone?: boolean };
    setIsStandalone(
      window.matchMedia("(display-mode: standalone)").matches || nav.standalone === true
    );
    setIsIos(/iphone|ipad|ipod/i.test(nav.userAgent));

    try {
      setDismissed(localStorage.getItem(DISMISSED_KEY) === "1");
    } catch {
      setDismissed(false);
    }

    function handleBeforeInstallPrompt(e: Event) {
      e.preventDefault();
      setInstallEvent(e as BeforeInstallPromptEvent);
    }
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  function dismiss() {
    setDismissed(true);
    try {
      localStorage.setItem(DISMISSED_KEY, "1");
    } catch {
      // Private browsing etc. — fine, it'll just ask again next visit.
    }
  }

  async function handleInstallClick() {
    if (!installEvent) return;
    await installEvent.prompt();
    const choice = await installEvent.userChoice;
    if (choice.outcome === "accepted") setInstallEvent(null);
  }

  if (isStandalone || dismissed) return null;
  // Desktop Chrome, Firefox, and anything else with neither the iOS path
  // nor a fired install prompt (yet) — nothing useful to show, so stay
  // quiet rather than give instructions that don't apply.
  if (!isIos && !installEvent) return null;

  return (
    <Card className="border-wcmt-coastal/30 bg-wcmt-coastal/5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-heading text-sm font-semibold text-wcmt-navy">
            📱 Get the app
          </p>
          {isIos ? (
            <p className="mt-1 text-xs leading-relaxed text-slate-600">
              For the best mobile experience, add this to your home screen:
              tap the Share button in Safari (the square with an arrow
              pointing up), then choose &ldquo;Add to Home Screen&rdquo;.
            </p>
          ) : (
            <>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">
                Install this as an app on your phone for quicker access and
                a full-screen view — no browser bars.
              </p>
              <Button
                type="button"
                variant="primary"
                onClick={handleInstallClick}
                className="mt-3 px-4 py-1.5 text-xs"
              >
                Install App
              </Button>
            </>
          )}
        </div>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss"
          className="shrink-0 text-slate-400 hover:text-slate-600"
        >
          ✕
        </button>
      </div>
    </Card>
  );
}
