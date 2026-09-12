"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";

// Reads a lesson's content aloud using the browser's built-in Web Speech
// API (window.speechSynthesis) — no external TTS service, API key or audio
// files needed, so there's nothing to host and nothing that can go stale
// when lesson content changes. Voice quality depends on the browser/device;
// most desktop and mobile browsers ship at least one usable voice.
export function LessonAudio({ text }: { text: string }) {
  const [supported, setSupported] = useState(false);
  const [state, setState] = useState<"idle" | "playing" | "paused">("idle");
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    setSupported(typeof window !== "undefined" && "speechSynthesis" in window);
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  function play() {
    if (!supported) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.95;
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
  );
}
