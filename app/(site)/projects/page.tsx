import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import ProjectGrid from "@/components/sections/ProjectGrid";
import Skills from "@/components/sections/Skills";

export const metadata = {
  title: "Projects",
  description: "Client builds and side projects: AI systems, mobile apps and production websites.",
};

export default function ProjectsPage() {
  return (
    <section className="space-y-16">
      <PageHeader eyebrow="Work" title="Projects">Client builds and side projects.</PageHeader>
      <ProjectGrid />
      <Skills />
      <p className="flex gap-6 text-sm text-neutral-400">
        <Link href="/skills" className="underline underline-offset-4 hover:text-white">Skills →</Link>
        <Link href="/github" className="underline underline-offset-4 hover:text-white">GitHub →</Link>
      </p>
    </section>
  );
}
