"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SidebarLink({ href, exact, children }: { href: string; exact?: boolean; children: React.ReactNode }) {
  const path = usePathname();
  const active = exact ? path === href : path === href || path.startsWith(`${href}/`);
  return (
    <Link
      href={href}
      className={`shrink-0 whitespace-nowrap rounded-md px-2 py-1.5 text-sm transition ${active ? "bg-white/10 text-white" : "text-neutral-400 hover:bg-white/5 hover:text-white"}`}
    >
      {children}
    </Link>
  );
}
