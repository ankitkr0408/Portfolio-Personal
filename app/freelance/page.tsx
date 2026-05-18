import Link from "next/link";

export const metadata = { title: "Freelance" };

export default function FreelancePage() {
  return (
    <section className="space-y-8 max-w-3xl">
      <header className="space-y-3">
        <p className="text-sm uppercase tracking-wider text-gray-500">
          Available for work
        </p>
        <h1 className="text-4xl font-bold tracking-tight">Freelance</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          I take on a small number of freelance projects each quarter — usually
          web apps, automations, or product engineering work where I can ship
          end-to-end.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Typical engagement", value: "2–8 weeks" },
          { label: "Working style", value: "Async + weekly sync" },
          { label: "Timezone", value: "IST · flexible" },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-lg border border-gray-200 dark:border-gray-800 p-4"
          >
            <p className="text-xs uppercase tracking-wider text-gray-500">
              {item.label}
            </p>
            <p className="font-semibold mt-1">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <h2 className="text-2xl font-semibold">What I take on</h2>
        <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
          <li>End-to-end web apps (Next.js, TypeScript)</li>
          <li>Cross-platform mobile MVPs</li>
          <li>Internal tools, dashboards, and automations</li>
          <li>Short technical consulting engagements</li>
        </ul>
      </div>

      <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-6 flex items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold">Got a project in mind?</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Tell me the scope and timeline and I&apos;ll reply within 48 hours.
          </p>
        </div>
        <Link
          href="/contact"
          className="rounded-md bg-foreground text-background px-4 py-2 text-sm font-medium hover:opacity-90"
        >
          Get in touch
        </Link>
      </div>
    </section>
  );
}
