import Link from "next/link";

export const metadata = { title: "Services" };

const services = [
  {
    slug: "web-development",
    title: "Web Development",
    blurb: "Marketing sites, dashboards, and full-stack web apps built to ship.",
  },
  {
    slug: "mobile-apps",
    title: "Mobile Apps",
    blurb: "Cross-platform mobile apps from prototype to App Store / Play Store.",
  },
  {
    slug: "consulting",
    title: "Consulting",
    blurb: "Technical strategy, architecture reviews, and hands-on advisory work.",
  },
  {
    slug: "branding",
    title: "Branding",
    blurb: "Visual identity, landing pages, and product-led brand systems.",
  },
];

export default function ServicesPage() {
  return (
    <section className="space-y-8">
      <header className="space-y-3">
        <h1 className="text-4xl font-bold tracking-tight">Services I Offer</h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
          Four ways I work with clients. Pick the closest fit — or{" "}
          <Link href="/contact" className="underline">get in touch</Link> if
          you&apos;d like to scope something custom.
        </p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2">
        {services.map((s) => (
          <Link
            key={s.slug}
            href={`/services/${s.slug}`}
            className="group rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:border-gray-400 dark:hover:border-gray-600 transition"
          >
            <h2 className="text-xl font-semibold group-hover:underline">
              {s.title}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {s.blurb}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
