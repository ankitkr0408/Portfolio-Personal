import Link from "next/link";
import CaseText from "../CaseText";
import { getContent } from "@/lib/content";

export default async function CaseStudies({ limit }: { limit?: number }) {
  const { caseStudies } = await getContent();
  const list = limit ? caseStudies.slice(0, limit) : caseStudies;
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {list.map((c) => (
        <article key={c.client} className="rounded-2xl border border-white/10 bg-neutral-950 p-6">
          <h3 className="text-xl font-semibold">
            <Link href={`/impact/${c.slug}`} className="hover:underline">{c.client}</Link>
          </h3>
          <dl className="mt-4 space-y-3 text-sm">
            <div><dt className="text-xs uppercase tracking-widest text-rose-400/80">Before</dt><dd className="text-neutral-400">{c.before}</dd></div>
            <div><dt className="text-xs uppercase tracking-widest text-rose-400/80">What I built</dt><dd className="text-neutral-200"><CaseText text={c.built} phrase={c.underline} action="underline" /></dd></div>
            <div><dt className="text-xs uppercase tracking-widest text-rose-400">Result</dt><dd className="text-neutral-200"><CaseText text={c.outcome} phrase={c.highlight} action="highlight" /></dd></div>
          </dl>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            {c.tags.map((t) => <span key={t} className="rounded-full border border-white/15 px-2.5 py-0.5 text-xs text-neutral-200">{t}</span>)}
            {c.href && <a href={c.href} target="_blank" rel="noreferrer" className="ml-auto text-xs text-neutral-400 hover:text-white">Visit site ↗</a>}
          </div>
        </article>
      ))}
    </div>
  );
}
