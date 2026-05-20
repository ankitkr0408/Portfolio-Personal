"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const DRAWER_LINKS = [
  { href: "/projects", label: "Projects" },
  { href: "/services", label: "Services" },
  { href: "/experience", label: "Experience" },
  { href: "/freelance", label: "Freelance" },
  { href: "/blog", label: "Blog" },
  { href: "/impact", label: "Impact" },
  { href: "/contact", label: "Contact" },
];

export default function HamburgerDrawer() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="grid h-10 w-10 place-items-center rounded-md border border-white/20 bg-black/40 backdrop-blur hover:bg-white/10 transition"
      >
        <span className="sr-only">Open menu</span>
        <div className="flex flex-col gap-1.5">
          <span className="block h-0.5 w-5 bg-white" />
          <span className="block h-0.5 w-5 bg-white" />
          <span className="block h-0.5 w-5 bg-white" />
        </div>
      </button>

      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!open}
      />

      <aside
        className={`fixed right-0 top-0 z-50 h-full w-80 max-w-[85vw] bg-neutral-950 border-l border-white/10 shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <span className="text-sm uppercase tracking-[0.2em] text-gray-400">
            Menu
          </span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="grid h-9 w-9 place-items-center rounded-md hover:bg-white/10 text-white"
          >
            ×
          </button>
        </div>
        <nav className="p-6">
          <ul className="space-y-2">
            {DRAWER_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-3 py-3 text-lg text-gray-200 hover:bg-white/10 hover:text-white transition"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}
