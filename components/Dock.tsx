"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Profile } from "@/lib/data";

type IconProps = { className?: string };
const svg = (children: React.ReactNode) =>
  function Icon({ className }: IconProps) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
        {children}
      </svg>
    );
  };

const Home = svg(<><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /><path d="M10 21v-6h4v6" /></>);
const Layers = svg(<><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 13 9 5 9-5" /></>);
const Briefcase = svg(<><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" /><path d="M3 13h18" /></>);
const Spark = svg(<><path d="M12 3v4M12 17v4M3 12h4M17 12h4" /><path d="m12 8 1.5 2.5L16 12l-2.5 1.5L12 16l-1.5-2.5L8 12l2.5-1.5L12 8Z" /></>);
const Mail = svg(<><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>);
const Github = svg(<><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></>);
const Instagram = svg(<><rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37Z" /><path d="M17.5 6.5h.01" /></>);
const Linkedin = svg(<><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6Z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></>);

const pages = [
  { href: "/", label: "Home", Icon: Home, match: [] as string[] },
  { href: "/projects", label: "Projects", Icon: Layers, match: ["/skills", "/github"] },
  { href: "/services", label: "Services", Icon: Briefcase, match: ["/freelance"] },
  { href: "/impact", label: "Impact", Icon: Spark, match: ["/experience", "/mentoring", "/blog", "/about"] },
];

const buildContactLinks = (profile: Profile) => [
  { label: "Email me", sub: profile.email, href: `mailto:${profile.email}?subject=Project%20inquiry`, Icon: Mail, external: false },
  { label: "Instagram", sub: `@${profile.instagramHandle}`, href: profile.instagram, Icon: Instagram, external: true },
  { label: "LinkedIn", sub: "Connect", href: profile.linkedin, Icon: Linkedin, external: true },
  { label: "GitHub", sub: profile.github, href: profile.githubUrl, Icon: Github, external: true },
];

const MAX_SCALE = 1.35;
const RANGE = 110;

export default function Dock({ profile }: { profile: Profile }) {
  const contactLinks = buildContactLinks(profile);
  const pathname = usePathname();
  const items = useRef<(HTMLElement | null)[]>([]);
  const wrap = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  // Close the contact flyout on navigation.
  useEffect(() => setOpen(false), [pathname]);

  // Close on outside click / Escape.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent | TouchEvent) => {
      if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Smart hide: away while scrolling down, back when scrolling up / near top / near bottom.
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const nearBottom = y + window.innerHeight >= document.documentElement.scrollHeight - 120;
      if (y < 120 || nearBottom || y < last - 6) setHidden(false);
      else if (y > last + 6) setHidden(true);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const magnify = (e: React.MouseEvent) => {
    items.current.forEach((el) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      const d = Math.abs(e.clientX - (r.left + r.width / 2));
      el.style.transform = `scale(${1 + (MAX_SCALE - 1) * Math.max(0, 1 - d / RANGE)})`;
    });
  };
  const reset = () => items.current.forEach((el) => el && (el.style.transform = "scale(1)"));

  const isActive = (href: string, match: string[]) =>
    href === "/" ? pathname === "/" : [href, ...match].some((h) => pathname.startsWith(h));
  const contactActive = pathname.startsWith("/contact");

  const cell =
    "group relative grid h-11 w-11 place-items-center rounded-full transition-[transform,color] duration-150 ease-out origin-bottom sm:h-14 sm:w-14";
  const icon = "h-[22px] w-[22px] sm:h-7 sm:w-7";
  const tip =
    "pointer-events-none absolute -top-10 hidden whitespace-nowrap rounded-md border border-white/10 bg-black px-2 py-1 text-sm text-white opacity-0 transition-opacity group-hover:opacity-100 sm:block";

  return (
    <nav
      aria-label="Main"
      className={`fixed left-1/2 z-50 -translate-x-1/2 transition-transform duration-300 ease-out ${hidden && !open ? "translate-y-[200%]" : "translate-y-0"}`}
      style={{ bottom: "max(1rem, env(safe-area-inset-bottom))" }}
    >
      <div
        ref={wrap}
        onMouseMove={magnify}
        onMouseLeave={() => { reset(); }}
        className="relative flex items-end gap-4 rounded-full border border-white/15 bg-black/70 px-5 py-3 shadow-2xl shadow-black/60 backdrop-blur-xl sm:gap-10 sm:px-12 sm:py-4"
      >
        {pages.map(({ href, label, Icon, match }, idx) => {
          const active = isActive(href, match);
          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              aria-current={active ? "page" : undefined}
              ref={(el) => { items.current[idx] = el; }}
              onClick={(e) => {
                if (href === "/" && pathname === "/" && window.scrollY > 200) {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
              className={`${cell} ${active ? "text-white" : "text-neutral-400 hover:text-white"}`}
            >
              <Icon className={icon} />
              {active && <span className="absolute -bottom-1 h-1 w-1 rounded-full bg-rose-500" />}
              <span className={tip}>{label}</span>
            </Link>
          );
        })}

        {/* Contact: opens a flyout with Email, LinkedIn, GitHub */}
        <div
          className="relative"
          onMouseEnter={() => window.matchMedia("(hover: hover)").matches && setOpen(true)}
          onMouseLeave={() => window.matchMedia("(hover: hover)").matches && setOpen(false)}
        >
          <button
            type="button"
            aria-label="Contact"
            aria-expanded={open}
            aria-haspopup="menu"
            ref={(el) => { items.current[pages.length] = el; }}
            onClick={() => setOpen((v) => !v)}
            className={`${cell} ${open || contactActive ? "text-white" : "text-neutral-400 hover:text-white"}`}
          >
            <Mail className={icon} />
            {contactActive && <span className="absolute -bottom-1 h-1 w-1 rounded-full bg-rose-500" />}
          </button>

          <div
            role="menu"
            className={`absolute bottom-full right-0 w-60 pb-3 transition duration-150 ${open ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"}`}
          >
            <div className="rounded-2xl border border-white/15 bg-black/90 p-2 shadow-2xl shadow-black/70 backdrop-blur-xl">
              {contactLinks.map(({ label, sub, href, Icon, external }) => (
                <a
                  key={label}
                  role="menuitem"
                  href={href}
                  {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-neutral-200 hover:bg-white/10"
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span className="min-w-0">
                    <span className="block text-sm font-medium">{label}</span>
                    <span className="block truncate text-xs text-neutral-500">{sub}</span>
                  </span>
                </a>
              ))}
              <Link href="/contact" role="menuitem" className="mt-1 block rounded-xl border-t border-white/10 px-3 py-2.5 text-sm text-neutral-300 hover:bg-white/10">
                Open contact page →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
