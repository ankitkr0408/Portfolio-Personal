import PageHeader from "@/components/PageHeader";
import GithubStats from "@/components/sections/GithubStats";

export const metadata = {
  title: "GitHub",
  description: "Open-source activity and repositories by Ankit Kumar.",
};

export default function Page() {
  return (
    <section>
      <PageHeader eyebrow="Built in the open" title="GitHub" />
      <GithubStats />
    </section>
  );
}
