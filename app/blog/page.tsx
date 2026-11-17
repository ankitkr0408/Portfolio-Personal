import PageHeader from "@/components/PageHeader";
import { linkedinPosts, profile } from "@/lib/data";

export const metadata = {
  title: "Blog",
  description: "Writing on engineering, automation and building products.",
};

export default function BlogPage() {
  return (
    <section className="max-w-3xl space-y-6">
      <PageHeader eyebrow="Blog" title="Writing">Long-form posts are coming. For now I share what I&apos;m building and learning on LinkedIn.</PageHeader>
      <a href={profile.linkedin} target="_blank" rel="noreferrer" className="inline-block rounded-full bg-white px-6 py-2.5 text-sm font-medium text-black">
        Follow on LinkedIn
      </a>
      <p className="pt-6 text-xs uppercase tracking-[0.25em] text-neutral-500">Recent mentions</p>
      {linkedinPosts.slice(0, 2).map((p) => (
        <a key={p.author} href={p.url} className="block rounded-2xl border border-white/10 bg-neutral-950 p-5 hover:border-sky-400/60">
          <p>&ldquo;{p.text}&rdquo;</p>
          <p className="mt-2 text-sm text-neutral-500">— {p.author}</p>
        </a>
      ))}
    </section>
  );
}
