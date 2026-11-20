import PageHeader from "@/components/PageHeader";
import ExperienceTimeline from "@/components/sections/ExperienceTimeline";

export const metadata = {
  title: "Experience",
  description: "Work history across backend, full-stack, AI and DevOps roles.",
};

export default function ExperiencePage() {
  return (
    <section>
      <PageHeader eyebrow="Background" title="Experience">The roles behind the freelance work.</PageHeader>
      <ExperienceTimeline />
    </section>
  );
}
