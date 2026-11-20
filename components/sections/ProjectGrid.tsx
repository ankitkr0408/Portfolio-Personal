import Link from "next/link";
import { getContent } from "@/lib/content";

export default async function ProjectGrid({ onlyFeatured = false }: { onlyFeatured?: boolean }) {
  const { projects } = await getContent();
  const list = onlyFeatured ? projects.filter((p) => p.featured) : projects;
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {list.map((p) => (
        <Link
          key={p.slug}
          href={`/projects/${p.slug}`}
          className="group rounded-2xl border border-white/10 bg-neutral-950 p-6 transition hover:border-white/40"
        >
          <h3 className="text-xl font-semibold group-hover:underline">{p.title}</h3>
          <p className="mt-3 text-sm text-neutral-400">{p.blurb}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {p.tags.map((t) => (
              <span key={t} className="rounded-full border border-white/15 px-2.5 py-0.5 text-xs text-neutral-200">
                {t}
              </span>
            ))}
          </div>
        </Link>
      ))}
    </div>
  );
}
