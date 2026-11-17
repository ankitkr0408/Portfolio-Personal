import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import Highlighter from "@/components/Highlighter";
import CaseStudies from "@/components/sections/CaseStudies";

export const metadata = {
  title: "Client Impact",
  description: "Case studies: offline businesses and manual workflows turned into automated web and mobile systems.",
};

export default function ImpactPage() {
  return (
    <section>
      <PageHeader eyebrow="Client impact" title="Offline to automated">
        Real businesses, real manual work, replaced with <Highlighter action="highlight">systems that run on their own</Highlighter>.
      </PageHeader>
      <CaseStudies />
      <p className="mt-10 flex flex-wrap gap-6 text-sm text-neutral-400">
        <Link href="/experience" className="underline underline-offset-4 hover:text-white">Experience →</Link>
        <Link href="/mentoring" className="underline underline-offset-4 hover:text-white">Mentoring →</Link>
        <Link href="/blog" className="underline underline-offset-4 hover:text-white">Blog →</Link>
        <Link href="/about" className="underline underline-offset-4 hover:text-white">About →</Link>
      </p>
    </section>
  );
}
