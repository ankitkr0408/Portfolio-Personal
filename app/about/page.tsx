import PageHeader from "@/components/PageHeader";
import Hats from "@/components/sections/Hats";
import About from "@/components/sections/About";

export const metadata = {
  title: "About",
  description: "Ankit Kumar is a freelance full-stack AI engineer who builds, ships on AWS and runs software for businesses.",
};

export default function Page() {
  return (
    <section>
      <PageHeader eyebrow="About" title="One engineer, three jobs">I build it, automate it with AI, and keep it running.</PageHeader>
      <div className="space-y-16"><Hats /><About /></div>
    </section>
  );
}
