import Link from "next/link";

export const metadata = { title: "Experience" };

const tracks = [
  {
    slug: "internship",
    title: "Internships",
    blurb: "Internship roles I've held and what I worked on.",
  },
  {
    slug: "job",
    title: "Full-Time Roles",
    blurb: "Full-time positions and the impact I drove at each.",
  },
];

export default function ExperiencePage() {
  return (
    <section className="space-y-8">
      <header className="space-y-3">
        <h1 className="text-4xl font-bold tracking-tight">Experience</h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
          Where I&apos;ve worked and what I&apos;ve built — split between
          internships and full-time roles.
        </p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2">
        {tracks.map((t) => (
          <Link
            key={t.slug}
            href={`/experience/${t.slug}`}
            className="group rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:border-gray-400 dark:hover:border-gray-600 transition"
          >
            <h2 className="text-xl font-semibold group-hover:underline">
              {t.title}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {t.blurb}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
