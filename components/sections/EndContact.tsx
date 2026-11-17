import { profile } from "@/lib/data";
import BlueprintHeading from "../BlueprintHeading";

export default function EndContact() {
  return (
    <section id="contact" className="border-t border-white/10 bg-neutral-950 pb-48 pt-28 text-center">
      <p className="mb-4 text-xs uppercase tracking-[0.25em] text-neutral-500">The end — or the beginning</p>
      <BlueprintHeading className="mx-auto max-w-4xl px-6 text-5xl md:text-8xl">
        You&apos;ve reached the end
      </BlueprintHeading>
      <p className="mt-6 font-serif text-2xl italic text-neutral-300">Let&apos;s build something important.</p>
      <p className="mt-2 text-sm text-neutral-500">I take a limited number of projects each quarter.</p>
      <a href={`mailto:${profile.email}?subject=Project%20inquiry`}
        className="mt-10 inline-block rounded-full bg-white px-8 py-3 font-medium text-black hover:opacity-90">
        {profile.email}
      </a>
      <div className="mt-6 flex justify-center gap-6 text-sm text-neutral-400">
        <a className="hover:text-white" href={profile.githubUrl} target="_blank" rel="noreferrer">GitHub</a>
        <a className="hover:text-white" href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
        <a className="hover:text-white" href={`tel:${profile.phone.replace(/\s/g, "")}`}>{profile.phone}</a>
      </div>
    </section>
  );
}
