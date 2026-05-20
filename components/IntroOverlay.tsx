"use client";

import { useEffect, useState } from "react";
import { ParticleTextEffect } from "./ParticleTextEffect";

const INTRO_WORDS = [
  "HELLO",
  "I'M ANKIT",
  "I BUILD",
  "I SHIP",
  "WELCOME",
];

const WORD_DURATION_MS = 5500;
const INTRO_DURATION_MS = INTRO_WORDS.length * WORD_DURATION_MS;
const FADE_DURATION_MS = 800;

export default function IntroOverlay() {
  const [mounted, setMounted] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const fadeTimer = window.setTimeout(() => setFading(true), INTRO_DURATION_MS);
    const removeTimer = window.setTimeout(() => {
      setMounted(false);
      document.body.style.overflow = "";
    }, INTRO_DURATION_MS + FADE_DURATION_MS);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(removeTimer);
      document.body.style.overflow = "";
    };
  }, []);

  const skip = () => {
    setFading(true);
    window.setTimeout(() => {
      setMounted(false);
      document.body.style.overflow = "";
    }, FADE_DURATION_MS);
  };

  if (!mounted) return null;

  return (
    <div
      onClick={skip}
      role="button"
      aria-label="Skip intro"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "black",
        opacity: fading ? 0 : 1,
        transition: `opacity ${FADE_DURATION_MS}ms ease-out`,
        cursor: "pointer",
        overflow: "hidden",
      }}
    >
      <ParticleTextEffect words={INTRO_WORDS} wordDurationMs={WORD_DURATION_MS} />
      <p
        style={{
          position: "absolute",
          bottom: 24,
          left: 0,
          right: 0,
          textAlign: "center",
          color: "#6b7280",
          fontSize: 12,
          letterSpacing: 2,
          textTransform: "uppercase",
          pointerEvents: "none",
        }}
      >
        click anywhere to skip
      </p>
    </div>
  );
}
