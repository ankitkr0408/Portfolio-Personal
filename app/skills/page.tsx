import PageHeader from "@/components/PageHeader";
import Skills from "@/components/sections/Skills";

export const metadata = {
  title: "Skills & Stack",
  description: "Full-stack, AI and DevOps skills: Next.js, Node.js, NestJS, Python, LLMs, RAG, AWS, PostgreSQL and CI/CD.",
};

export default function Page() {
  return (
    <section>
      <PageHeader eyebrow="The stack behind it" title="Skills" />
      <Skills />
    </section>
  );
}
