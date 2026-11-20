"use client";

import { useEffect, useRef, useState } from "react";
import Avatar from "../Avatar";

type Props = { name: string; role: string; photo: string };

// Scroll-driven intro: the section pins to the screen and each word appears as you scroll,
// with the bar at the bottom tracking progress. Scroll back up and the words go away again.
export default function ScrollIntro({ name, role, photo }: Props) {
  const first = name.split(" ")[0];
  const tokens: ("avatar" | { text: string; accent?: boolean })[] = [
    { text: "HELLO," },
    { text: "I'M" },
    { text: first.toUpperCase() },
    "avatar",
    ...role.toUpperCase().split(" ").map((text) => ({ text })),
    { text: "WHO" },
    { text: "SHIPS", accent: true },
  ];
  const n = tokens.length;

  const wrap = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = wrap.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const range = r.height - window.innerHeight;
      setP(range > 0 ? Math.min(1, Math.max(0, -r.top / range)) : 1);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Words fill the first 80% of the scroll; the last 20% holds the finished line.
  const wordP = (i: number) => {
    if (reduced) return 1;
    const start = (i / n) * 0.8 - 0.02;
    return Math.min(1, Math.max(0, (p - start) / 0.06));
  };

  return (
    <div ref={wrap} className="relative h-[380vh] bg-[#0a0a0a]">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden">
        <div className="flex max-w-5xl flex-wrap items-center justify-center gap-x-3 gap-y-2 px-6 text-center text-2xl font-light uppercase tracking-tight text-white sm:gap-x-4 sm:text-4xl md:text-5xl">
          {tokens.map((t, i) => {
            const w = wordP(i);
            return (
              <span key={i} style={{ opacity: w, transform: `translateY(${(1 - w) * 16}px)`, filter: `blur(${(1 - w) * 6}px)` }}>
                {t === "avatar" ? (
                  <span className="inline-block align-middle">
                    <Avatar src={photo} name={name} size={64} />
                  </span>
                ) : (
                  <span className={t.accent ? "font-semibold text-rose-500" : ""}>{t.text}</span>
                )}
              </span>
            );
          })}
        </div>

        <p
          className="absolute bottom-20 text-xs uppercase tracking-[0.3em] text-neutral-500 transition-opacity duration-300"
          style={{ opacity: p < 0.03 ? 1 : 0 }}
        >
          Scroll
        </p>

        <div className="absolute bottom-12 left-6 right-6 sm:left-12 sm:right-12">
          <div className="h-1.5 w-full rounded-full bg-white/10">
            <div className="relative h-full rounded-full bg-white" style={{ width: `${p * 100}%` }}>
              <span className="absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 translate-x-1/2 rounded-full bg-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
