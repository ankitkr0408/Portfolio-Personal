"use client";

import { useEffect, useState } from "react";

export const THEME_KEY = "site-theme";
type Theme = "day" | "night";

// Day = colorful neo-brutalist, Night = the original black theme.
// The attribute lives on <html> so the body background changes too; it is removed again
// when leaving the public site (e.g. into /admin), which keeps its own look.
export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("day");

  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(THEME_KEY);
    } catch {}
    const t: Theme = saved === "night" ? "night" : "day";
    setTheme(t);
    document.documentElement.dataset.siteTheme = t;
    return () => {
      delete document.documentElement.dataset.siteTheme;
    };
  }, []);

  const flip = () => {
    const next: Theme = theme === "day" ? "night" : "day";
    setTheme(next);
    document.documentElement.dataset.siteTheme = next;
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {}
  };

  const isDay = theme === "day";
  return (
    <button
      type="button"
      onClick={flip}
      aria-label={isDay ? "Switch to night mode" : "Switch to day mode"}
      title={isDay ? "Night mode" : "Day mode"}
      className="theme-toggle fixed right-4 top-4 z-[60] flex h-11 items-center gap-2 rounded-full border border-white/25 bg-black/60 px-4 text-sm font-medium text-white backdrop-blur-md transition hover:bg-black/80"
    >
      <span aria-hidden className="text-lg leading-none">{isDay ? "🌙" : "☀️"}</span>
      <span className="hidden sm:inline">{isDay ? "Night" : "Day"}</span>
    </button>
  );
}
