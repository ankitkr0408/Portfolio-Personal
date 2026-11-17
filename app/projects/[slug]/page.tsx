import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import BlueprintHeading from "@/components/BlueprintHeading";
import { projects } from "@/lib/data";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = projects.find((x) => x.slug === params.slug);
  if (!p) return {};
  return { title: `${p.title} — Project`, description: p.blurb };
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const p = projects.find((x) => x.slug === params.slug);
  if (!p) notFound();
  return (
    <article className="max-w-3xl space-y-8">
      <Link href="/projects" className="text-sm text-neutral-400 hover:text-white">← Projects</Link>
      <BlueprintHeading className="text-4xl md:text-6xl">{p.title}</BlueprintHeading>
      <p className="text-lg text-neutral-200">{p.blurb}</p>
      <div className="flex flex-wrap gap-2">{p.tags.map((t) => <span key={t} className="rounded-full border border-white/15 px-3 py-1 text-sm">{t}</span>)}</div>
      <div className="flex flex-wrap gap-3">
        {p.href.startsWith("http") && <a href={p.href} target="_blank" rel="noreferrer" className="rounded-full border border-white/20 px-6 py-2.5 text-sm hover:bg-white/10">View project ↗</a>}
        <Link href="/contact" className="rounded-full bg-white px-6 py-2.5 text-sm font-medium text-black">Build something similar</Link>
      </div>
    </article>
  );
}
