import PageHeader from "@/components/PageHeader";
import { getContent } from "@/lib/content";

export const metadata = {
  title: "Contact",
  description: "Get in touch to build, automate or fix your software.",
};

export default async function ContactPage() {
  const { profile } = await getContent();
  return (
    <section className="max-w-2xl">
      <PageHeader eyebrow="Contact" title="Let's talk">
        Tell me what you need built, automated or fixed. I reply within 48 hours, with a plan, not a pitch.
      </PageHeader>
      <div className="space-y-6 rounded-2xl border border-white/10 bg-neutral-950 p-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-neutral-500">Email</p>
          <a href={`mailto:${profile.email}`} className="break-all text-lg font-medium underline underline-offset-4">{profile.email}</a>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-neutral-500">Phone</p>
          <a href={`tel:${profile.phone.replace(/\s/g, "")}`} className="text-lg">{profile.phone}</a>
        </div>
        <div className="flex flex-wrap gap-3">
          <a href={`mailto:${profile.email}?subject=Project%20inquiry`} className="rounded-full bg-white px-6 py-2.5 text-sm font-medium text-black">Start a project</a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer" className="rounded-full border border-white/20 px-6 py-2.5 text-sm hover:bg-white/10">LinkedIn</a>
          <a href={profile.instagram} target="_blank" rel="noreferrer" className="rounded-full border border-white/20 px-6 py-2.5 text-sm hover:bg-white/10">Instagram</a>
          <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="rounded-full border border-white/20 px-6 py-2.5 text-sm hover:bg-white/10">GitHub</a>
        </div>
      </div>
    </section>
  );
}
