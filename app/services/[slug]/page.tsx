import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import BlueprintHeading from "@/components/BlueprintHeading";
import { services } from "@/lib/data";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const s = services.find((x) => x.slug === params.slug);
  return s ? { title: s.title, description: s.intro } : {};
}

export default function ServicePage({ params }: { params: { slug: string } }) {
  const s = services.find((x) => x.slug === params.slug);
  if (!s) notFound();
  return (
    <section className="max-w-3xl space-y-6">
      <Link href="/services" className="text-sm text-neutral-400 hover:text-white">← Services</Link>
      <BlueprintHeading className="text-5xl md:text-6xl">{s.title}</BlueprintHeading>
      <p className="text-lg text-neutral-200">{s.intro}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {s.offers.map((o) => (
          <div key={o} className="rounded-lg border border-white/10 bg-neutral-950 p-4 text-sm">{o}</div>
        ))}
      </div>
      <p className="font-serif text-xl italic text-neutral-200">{s.proof}</p>
      <Link href="/contact" className="inline-block rounded-full bg-white px-6 py-2.5 text-sm font-medium text-black">Start a project</Link>
    </section>
  );
}
