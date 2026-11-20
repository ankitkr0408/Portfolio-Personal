import Link from "next/link";
import type { Metadata } from "next";
import { logout } from "../actions";
import { requireAdmin } from "@/lib/admin/session";
import { SECTIONS } from "@/lib/content-schema";
import SidebarLink from "@/components/admin/SidebarLink";

export const metadata: Metadata = { title: { default: "Admin", template: "%s · Admin" }, robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 md:grid md:grid-cols-[250px_1fr]">
      <aside className="border-b border-white/10 p-4 md:sticky md:top-0 md:h-screen md:overflow-y-auto md:border-b-0 md:border-r">
        <Link href="/admin" className="mb-4 flex items-center gap-2.5 px-2">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-pink-500 to-rose-600 text-sm font-bold">A</span>
          <span className="font-semibold">Portfolio admin</span>
        </Link>
        <nav className="flex gap-1 overflow-x-auto pb-2 md:flex-col md:overflow-visible md:pb-0">
          <SidebarLink href="/admin" exact>Dashboard</SidebarLink>
          <p className="hidden px-2 pb-1 pt-4 text-[11px] uppercase tracking-widest text-neutral-500 md:block">Content</p>
          {SECTIONS.map((s) => (
            <SidebarLink key={s.key} href={`/admin/${s.key}`}>{s.title}</SidebarLink>
          ))}
        </nav>
        <div className="mt-4 hidden space-y-1 border-t border-white/10 pt-4 md:block">
          <a href="/" target="_blank" rel="noreferrer" className="block rounded-md px-2 py-1.5 text-sm text-neutral-400 hover:bg-white/5 hover:text-white">View site ↗</a>
          <form action={logout}>
            <button className="w-full rounded-md px-2 py-1.5 text-left text-sm text-neutral-400 hover:bg-white/5 hover:text-white">Sign out</button>
          </form>
        </div>
      </aside>
      <main className="min-w-0 p-5 md:p-10">{children}</main>
    </div>
  );
}
