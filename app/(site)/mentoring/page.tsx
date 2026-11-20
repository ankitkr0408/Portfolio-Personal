import PageHeader from "@/components/PageHeader";
import ImpactCards from "@/components/sections/ImpactCards";

export const metadata = {
  title: "Mentoring",
  description: "Hackathon judging, mentoring and workshops by Ankit Kumar.",
};

export default function Page() {
  return (
    <section>
      <PageHeader eyebrow="Trusted to judge and mentor" title="Mentoring" />
      <ImpactCards />
    </section>
  );
}
