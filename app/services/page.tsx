import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { services } from "@/lib/data";

export const metadata = {
  title: "Services",
  description: "Web development, mobile apps, AI and DevOps consulting, and landing pages by a freelance engineer.",
};

export default function ServicesPage() {
  return (
    <section>
      <PageHeader eyebrow="Services" title="What I build">
        Four ways to work together. Pick the closest fit or <Link href="/contact" className="underline">scope something custom</Link>.
      </PageHeader>
      <div className="grid gap-5 sm:grid-cols-2">
        {services.map((s) => (
          <Link key={s.slug} href={`/services/${s.slug}`} className="group rounded-2xl border border-white/10 bg-neutral-950 p-6 transition hover:border-white/40">
            <h2 className="text-xl font-semibold group-hover:underline">{s.title}</h2>
            <p className="mt-2 text-sm text-neutral-400">{s.blurb}</p>
          </Link>
        ))}
      </div>
      <p className="mt-10 flex flex-wrap gap-6 text-sm text-neutral-400">
        <Link href="/freelance" className="underline underline-offset-4 hover:text-white">Freelance details →</Link>
        <Link href="/services/consulting" className="underline underline-offset-4 hover:text-white">AI &amp; DevOps →</Link>
      </p>
    </section>
  );
}
