import Link from "next/link";
import SplineRobot from "@/components/SplineRobot";
import AskAIButton from "@/components/AskAIButton";
import AskIcon from "@/components/AskIcon";
import ScrollIntro from "@/components/sections/ScrollIntro";
import Section from "@/components/sections/Section";
import Hats from "@/components/sections/Hats";
import Bento from "@/components/sections/Bento";
import CaseStudies from "@/components/sections/CaseStudies";
import ProcessSteps from "@/components/sections/ProcessSteps";
import ProjectGrid from "@/components/sections/ProjectGrid";
import ReelsDeck from "@/components/sections/ReelsDeck";
import EndContact from "@/components/sections/EndContact";
import { getContent } from "@/lib/content";

export default async function LandingPage() {
  const { profile, projects, impact } = await getContent();
  const featured = projects.find((p) => p.featured) ?? projects[0];
  return (
    <div className="home-root bg-black text-white">
      <ScrollIntro name={profile.name} role={profile.role} photo={profile.photo} />
      <div className="hero-stage relative h-screen w-full overflow-hidden">
        <SplineRobot />

        <header className="absolute top-0 left-0 right-0 z-20 flex items-center p-6">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-pink-500 to-rose-600 font-bold text-white">A</span>
            <span className="font-semibold tracking-tight text-white">{profile.name}</span>
          </Link>
          </header>

        <div className="hero-copy pointer-events-none absolute left-6 top-1/3 z-10 max-w-xl md:left-16">
          <p className="text-xs uppercase tracking-[0.25em] text-neutral-400">{profile.role}</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight md:text-6xl">
            Build it. Automate it. <span className="font-serif italic">Keep it running.</span>
          </h1>
          <p className="mt-4 text-neutral-300">{profile.pitch}</p>
          <AskAIButton className="pointer-events-auto mt-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-medium text-white backdrop-blur-md transition hover:border-rose-400/60 hover:bg-rose-500/20">
            <AskIcon className="ask-wiggle h-5 w-5" /> Ask anything about me
          </AskAIButton>
        </div>

      </div>

      <Section id="hats" eyebrow="One engineer, three jobs" title="Build. Automate. Run."><Hats /></Section>
      <Section id="glance" eyebrow="At a glance" title="Meet Ankit"><Bento profile={profile} featured={featured} event={impact[0]} /></Section>
      <Section id="case-studies" eyebrow="Proof, not promises" title="Offline to automated">
        <CaseStudies limit={3} />
        <Link href="/impact" className="mt-8 inline-block text-sm underline underline-offset-4">All case studies →</Link>
      </Section>
      <Section id="work" eyebrow="Shipped and live" title="Selected work">
        <ProjectGrid onlyFeatured />
        <Link href="/projects" className="mt-8 inline-block text-sm underline underline-offset-4">All projects →</Link>
      </Section>
      <Section id="freelance" eyebrow="No surprises" title="How I work">
        <ProcessSteps />
        <div className="mt-8 flex flex-wrap gap-6 text-sm">
          <Link href="/freelance" className="underline underline-offset-4">Freelance details →</Link>
          <Link href="/skills" className="underline underline-offset-4">Skills →</Link>
          <Link href="/github" className="underline underline-offset-4">GitHub →</Link>
          <Link href="/experience" className="underline underline-offset-4">Experience →</Link>
          <Link href="/mentoring" className="underline underline-offset-4">Mentoring →</Link>
        </div>
      </Section>
      <ReelsDeck />
      <EndContact />
    </div>
  );
}
