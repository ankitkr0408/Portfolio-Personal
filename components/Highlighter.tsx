"use client";

import { useEffect, useRef } from "react";
import { annotate } from "rough-notation";

type Props = {
  children: React.ReactNode;
  action?: "highlight" | "underline";
  color?: string;
  strokeWidth?: number;
  iterations?: number;
};

const COLORS = {
  highlight: "rgba(56, 160, 255, 0.45)",
  underline: "#f59e0b",
};

// Hand-drawn marker/underline that animates in when scrolled into view.
export default function Highlighter({
  children,
  action = "highlight",
  color,
  strokeWidth = 1.5,
  iterations = 2,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const a = annotate(el, {
      type: action,
      color: color ?? COLORS[action],
      strokeWidth,
      iterations,
      padding: action === "highlight" ? 3 : 2,
      animationDuration: 700,
      animate: !reduce,
      multiline: true,
    });
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          a.show();
          io.disconnect();
        }
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      a.remove();
    };
  }, [action, color, strokeWidth, iterations]);

  return <span ref={ref}>{children}</span>;
}
