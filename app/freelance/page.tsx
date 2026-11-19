import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import ProcessSteps from "@/components/sections/ProcessSteps";
import CaseStudies from "@/components/sections/CaseStudies";
import { freelanceFacts as facts } from "@/lib/data";

export const metadata = {
  title: "Freelance",
  description: "Hire a freelance full-stack AI engineer for web, mobile and automation projects.",
};

export default function FreelancePage() {
  return (
    <section className="space-y-20">
      <div>
        <PageHeader eyebrow="Available for work" title="Freelance">
          One engineer for the whole job: I build it, automate it with AI, and keep it running. I take a small number of projects each quarter so each one gets full attention.
        </PageHeader>
        <div className="grid gap-4 sm:grid-cols-3">
          {facts.map((f) => (
            <div key={f.label} className="rounded-2xl border border-white/10 bg-neutral-950 p-5">
              <p className="text-xs uppercase tracking-widest text-neutral-500">{f.label}</p>
              <p className="mt-1 font-semibold">{f.value}</p>
            </div>
          ))}
        </div>
      </div>
      <div><PageHeader eyebrow="Process" title="How I work" /><ProcessSteps /></div>
      <div><PageHeader eyebrow="Proof" title="Recent results" /><CaseStudies /></div>
      <div className="rounded-2xl border border-white/10 bg-neutral-950 p-8 text-center">
        <p className="font-serif text-3xl italic">Got a manual process to kill?</p>
        <p className="mt-2 text-neutral-400">Tell me the scope and timeline. I reply within 48 hours.</p>
        <Link href="/contact" className="mt-6 inline-block rounded-full bg-white px-8 py-3 text-sm font-medium text-black">Get in touch</Link>
      </div>
    </section>
  );
}
