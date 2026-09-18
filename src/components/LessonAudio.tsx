"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";

// Reads a lesson's content aloud using the browser's built-in Web Speech
// API (window.speechSynthesis) — no external TTS service, API key or audio
// files needed, so there's nothing to host and nothing that can go stale
// when lesson content changes. Voice quality and accent depend entirely on
// what voices the browser/OS ships, so we pick the best-matching Australian
// English voice available rather than letting the browser default to a
// US/UK voice, and fall back gracefully where no AU voice exists.
const AU_NAME_HINTS = [
  "australia",
  "natasha", // Microsoft Edge/Windows AU neural voice
  "william", // Microsoft Edge/Windows AU neural voice
  "catherine", // Windows AU voice
  "karen", // macOS/iOS AU voice
  "lee", // macOS/iOS AU voice
  "matilda", // macOS/iOS AU voice
];

function scoreVoice(voice: SpeechSynthesisVoice): number {
  const lang = voice.lang.toLowerCase();
  const name = voice.name.toLowerCase();
  let score = 0;
  if (lang === "en-au") score += 100;
  else if (lang.startsWith("en-au")) score += 90;
  else if (lang.startsWith("en-gb")) score += 20; // closer to AU than US as a fallback
  else if (lang.startsWith("en")) score += 5;
  else return -1; // not an English voice at all — never usable here

  if (AU_NAME_HINTS.some((hint) => name.includes(hint))) score += 30;
  if (name.includes("neural") || name.includes("natural") || name.includes("online")) score += 10;
  if (name.includes("google")) score += 5;
  return score;
}

function pickBestVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  let best: SpeechSynthesisVoice | null = null;
  let bestScore = -1;
  for (const v of voices) {
    const s = scoreVoice(v);
    if (s > bestScore) {
      bestScore = s;
      best = v;
    }
  }
  return best;
}

export function LessonAudio({ text }: { text: string }) {
  const [supported, setSupported] = useState(false);
  const [state, setState] = useState<"idle" | "playing" | "paused">("idle");
  const [isIOS, setIsIOS] = useState(false);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    const hasSpeech = typeof window !== "undefined" && "speechSynthesis" in window;
    setSupported(hasSpeech);

    // iPhones/iPads ship a very flat, low-effort default reading voice for
    // web pages (Safari's Web Speech API only exposes the *compact*
    // system voice unless a better one has been downloaded on the device —
    // there's no code-side fix for this, it's an iOS setting). Detecting
    // iOS here just decides whether to show the tip below telling students
    // how to fix it themselves; iPadOS reports as "MacIntel" with touch
    // support, which is why that's checked too, not just iPhone/iPod.
    const ua = window.navigator.userAgent;
    setIsIOS(
      /iPad|iPhone|iPod/.test(ua) ||
        (window.navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
    );

    if (!hasSpeech) return;

    function loadVoices() {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        voiceRef.current = pickBestVoice(voices);
      }
    }
    loadVoices();
    // Most browsers load voices asynchronously the first time; this fires
    // once the full voice list is ready.
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
      window.speechSynthesis.cancel();
    };
  }, []);

  function play() {
    if (!supported) return;
    window.speechSynthesis.cancel();
    // Lesson content can carry light **bold** markers for on-page emphasis
    // (see the module page's renderInline) — strip them here so the reader
    // doesn't speak the literal asterisks aloud.
    const spokenText = text.replace(/\*\*/g, "");
    const utter = new SpeechSynthesisUtterance(spokenText);
    // A slightly relaxed pace reads as more conversational than a flat 1.0.
    utter.rate = 0.98;
    utter.pitch = 1.0;
    if (voiceRef.current) {
      utter.voice = voiceRef.current;
      utter.lang = voiceRef.current.lang;
    } else {
      utter.lang = "en-AU";
    }
    utter.onend = () => setState("idle");
    utter.onerror = () => setState("idle");
    utterRef.current = utter;
    window.speechSynthesis.speak(utter);
    setState("playing");
  }

  function pause() {
    window.speechSynthesis.pause();
    setState("paused");
  }

  function resume() {
    window.speechSynthesis.resume();
    setState("playing");
  }

  function stop() {
    window.speechSynthesis.cancel();
    setState("idle");
  }

  if (!supported) return null;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        {state === "idle" && (
          <Button variant="outline" onClick={play} className="px-3 py-1.5 text-xs">
            🔊 Listen to this lesson
          </Button>
        )}
        {state === "playing" && (
          <>
            <Button variant="outline" onClick={pause} className="px-3 py-1.5 text-xs">
              ⏸ Pause
            </Button>
            <Button variant="outline" onClick={stop} className="px-3 py-1.5 text-xs">
              ⏹ Stop
            </Button>
          </>
        )}
        {state === "paused" && (
          <>
            <Button variant="outline" onClick={resume} className="px-3 py-1.5 text-xs">
              ▶ Resume
            </Button>
            <Button variant="outline" onClick={stop} className="px-3 py-1.5 text-xs">
              ⏹ Stop
            </Button>
          </>
        )}
      </div>
      {/*
        There's no code-side fix for iOS's flat default reading voice — see
        the comment above on isIOS. This just tells students the one thing
        that does fix it: downloading a better system voice, which Safari
        then picks up automatically next time this page loads.
      */}
      {isIOS && (
        <details className="text-xs text-slate-500">
          <summary className="cursor-pointer select-none font-medium text-wcmt-navy underline decoration-dotted">
            Sounds robotic on iPhone/iPad? Here&apos;s a quick fix
          </summary>
          <p className="mt-1 max-w-md">
            iPhones use a very basic voice for reading web pages by default. For a much more
            natural one: open <strong>Settings → Accessibility → Read &amp; Speak → Voices →
            English → Voice</strong>. We recommend switching to <strong>Lee</strong> or{" "}
            <strong>Matilda (Premium)</strong> to suit this content. Come back and reload this
            page afterwards — Listen to this lesson will use it automatically.
          </p>
        </details>
      )}
    </div>
  );
}
