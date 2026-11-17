"use client";

import { useEffect, useRef } from "react";

type Props = {
  text: string;
  /** Base speed in px/second. */
  speed?: number;
  /** Start moving the opposite way. */
  reverse?: boolean;
  className?: string;
};

const COPIES = 6;

// Scroll-reactive text marquee: drifts on its own, speeds up while you scroll,
// and flips direction whenever you change scroll direction.
export default function ScrollMarquee({ text, speed = 50, reverse = false, className = "" }: Props) {
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const sign = reverse ? -1 : 1;
    let x = 0;
    let dir = 1; // 1 = scrolling down, -1 = scrolling up
    let boost = 0;
    let lastY = window.scrollY;
    let last = performance.now();
    let raf = 0;
    let visible = true;

    const onScroll = () => {
      const y = window.scrollY;
      const dy = y - lastY;
      lastY = y;
      if (dy !== 0) dir = dy > 0 ? 1 : -1;
      boost = Math.min(boost + Math.abs(dy) * 6, 700);
    };

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (visible) {
        const w = el.scrollWidth / COPIES;
        x -= sign * dir * (speed + boost) * dt;
        if (w > 0) x = ((x % w) - w) % w; // wrap into (-w, 0]
        el.style.transform = `translate3d(${x}px,0,0)`;
      }
      boost *= Math.exp(-dt * 3.5);
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [speed, reverse]);

  return (
    <div className="overflow-hidden" aria-hidden>
      <div ref={track} className={`flex w-max whitespace-nowrap will-change-transform ${className}`}>
        {Array.from({ length: COPIES }).map((_, i) => (
          <span key={i} className="px-6">{text}</span>
        ))}
      </div>
    </div>
  );
}
