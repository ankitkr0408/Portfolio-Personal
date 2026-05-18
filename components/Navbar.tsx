"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/services", label: "Services" },
  { href: "/experience", label: "Experience" },
  { href: "/freelance", label: "Freelance" },
  { href: "/blog", label: "Blog" },
  { href: "/impact", label: "Impact" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-background/80 backdrop-blur z-10">
      <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight">
          Ankit Kumar
        </Link>
        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={
                  isActive(l.href)
                    ? "font-medium underline underline-offset-4"
                    : "text-gray-600 dark:text-gray-400 hover:text-foreground"
                }
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
