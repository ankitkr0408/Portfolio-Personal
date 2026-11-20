import Link from "next/link";
import Avatar from "../Avatar";
import { getContent } from "@/lib/content";

export default async function About() {
  const { profile } = await getContent();
  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col items-center gap-10 px-6 py-20 md:flex-row">
      <Avatar src={profile.photo} name={profile.name} size={176} />
      <div className="space-y-4 text-center md:text-left">
        <p className="text-xs uppercase tracking-[0.25em] text-neutral-500">Hi, I&apos;m {profile.name}</p>
        <p className="font-serif text-3xl italic leading-snug md:text-4xl">
          Most businesses lose hours to work a system could do. I\u2019m the engineer who builds that system, automates it with AI, and keeps it running.
        </p>
        <p className="text-neutral-400">
          Full-stack, AI and cloud in one person: from the first audit to Play Store releases and production deploys, with nothing handed off and nothing dropped. Based in {profile.location}, working with clients remotely.
        </p>
        <div className="flex flex-wrap justify-center gap-3 md:justify-start">
          <Link href="/contact" className="rounded-full bg-white px-6 py-2.5 text-sm font-medium text-black">Start a project</Link>
          <Link href="/impact" className="rounded-full border border-white/20 px-6 py-2.5 text-sm hover:bg-white/10">See case studies</Link>
        </div>
      </div>
    </section>
  );
}
