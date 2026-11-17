import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import BlueprintHeading from "@/components/BlueprintHeading";
import CaseText from "@/components/CaseText";
import { caseStudies } from "@/lib/data";

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const c = caseStudies.find((x) => x.slug === params.slug);
  if (!c) return {};
  return { title: `${c.client} — Case Study`, description: `${c.built} ${c.outcome}` };
}

export default function CaseStudyPage({ params }: { params: { slug: string } }) {
  const c = caseStudies.find((x) => x.slug === params.slug);
  if (!c) notFound();
  return (
    <article className="max-w-3xl space-y-8">
      <Link href="/impact" className="text-sm text-neutral-400 hover:text-white">← Client impact</Link>
      <BlueprintHeading className="text-4xl md:text-6xl">{c.client}</BlueprintHeading>
      <dl className="space-y-6">
        <div><dt className="text-xs uppercase tracking-widest text-rose-400/80">Before</dt><dd className="mt-1 text-lg text-neutral-200">{c.before}</dd></div>
        <div><dt className="text-xs uppercase tracking-widest text-rose-400/80">What I built</dt><dd className="mt-1 text-lg"><CaseText text={c.built} phrase={c.underline} action="underline" /></dd></div>
        <div><dt className="text-xs uppercase tracking-widest text-rose-400">Result</dt><dd className="mt-1 text-lg"><CaseText text={c.outcome} phrase={c.highlight} action="highlight" /></dd></div>
      </dl>
      <div className="flex flex-wrap gap-2">{c.tags.map((t) => <span key={t} className="rounded-full border border-white/15 px-3 py-1 text-sm">{t}</span>)}</div>
      <div className="flex flex-wrap gap-3">
        {c.href && <a href={c.href} target="_blank" rel="noreferrer" className="rounded-full border border-white/20 px-6 py-2.5 text-sm hover:bg-white/10">Visit site ↗</a>}
        <Link href="/contact" className="rounded-full bg-white px-6 py-2.5 text-sm font-medium text-black">Start a project</Link>
      </div>
    </article>
  );
}
