import Link from "next/link";
import { SECTIONS } from "@/lib/content-schema";
import { contentChecks } from "@/lib/admin/checks";
import { getContent, getSectionStatuses } from "@/lib/content";
import { hasDb } from "@/lib/mongo";
import { defaultContent, type SiteContent } from "@/lib/data";

export const metadata = { title: "Dashboard" };

const count = (v: unknown): string => {
  if (Array.isArray(v)) return `${v.length} item${v.length === 1 ? "" : "s"}`;
  if (v && typeof v === "object") return `${Object.keys(v).length} entries`;
  return "";
};

function ago(iso: string | null) {
  if (!iso) return "never edited";
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  if (mins < 60 * 24) return `${Math.round(mins / 60)} h ago`;
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default async function Dashboard() {
  const db = hasDb();
  let content: SiteContent = defaultContent;
  let statuses = SECTIONS.map((s) => ({ key: s.key, customized: false, updatedAt: null as string | null }));
  let dbError = false;
  if (db) {
    try {
      [content, statuses] = await Promise.all([getContent(), getSectionStatuses()]);
    } catch {
      dbError = true;
    }
  }
  const checks = contentChecks(content);
  const statusOf = Object.fromEntries(statuses.map((s) => [s.key, s]));

  return (
    <div className="max-w-5xl space-y-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">Dashboard</h1>
        <p className="text-neutral-400">Edit anything on the site. Saving publishes instantly.</p>
      </header>

      {!db && (
        <div className="rounded-xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-100">
          <p className="font-medium">MongoDB is not connected.</p>
          <p className="mt-1 text-amber-200/80">
            You are looking at the built-in defaults from <code>lib/data.ts</code> and saving is disabled. Set <code>MONGODB_URI</code> in <code>.env.local</code> (see <code>.env.example</code>) and restart.
          </p>
        </div>
      )}
      {dbError && <div className="rounded-xl border border-rose-400/30 bg-rose-400/10 p-4 text-sm text-rose-200">Could not read from MongoDB. Check the connection string and Atlas network access.</div>}

      <section className="space-y-3">
        <h2 className="text-sm uppercase tracking-widest text-neutral-500">Needs attention {checks.length ? `(${checks.length})` : ""}</h2>
        {checks.length === 0 ? (
          <p className="rounded-xl border border-white/10 bg-neutral-900 p-4 text-sm text-neutral-300">Nothing to flag. Content looks complete.</p>
        ) : (
          <ul className="divide-y divide-white/10 overflow-hidden rounded-xl border border-white/10 bg-neutral-900">
            {checks.map((c, i) => (
              <li key={i}>
                <Link href={`/admin/${c.section}`} className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-white/5">
                  <span className={`h-2 w-2 shrink-0 rounded-full ${c.level === "warn" ? "bg-amber-400" : "bg-sky-400"}`} />
                  <span className="flex-1 text-neutral-200">{c.text}</span>
                  <span className="text-neutral-500">Fix →</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-sm uppercase tracking-widest text-neutral-500">Sections</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SECTIONS.map((s) => {
            const st = statusOf[s.key];
            return (
              <Link key={s.key} href={`/admin/${s.key}`} className="group rounded-xl border border-white/10 bg-neutral-900 p-4 transition hover:border-rose-400/50">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-medium">{s.title}</h3>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] ${st?.customized ? "bg-emerald-400/15 text-emerald-300" : "bg-white/10 text-neutral-400"}`}>
                    {st?.customized ? "Edited" : "Default"}
                  </span>
                </div>
                <p className="mt-1 text-sm text-neutral-500">{count(content[s.key])} · {ago(st?.updatedAt ?? null)}</p>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
