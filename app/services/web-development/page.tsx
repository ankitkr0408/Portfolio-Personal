export const metadata = { title: "Web Development" };

export default function WebDevelopmentPage() {
  return (
    <section className="space-y-6 max-w-3xl">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-wider text-gray-500">Service</p>
        <h1 className="text-4xl font-bold tracking-tight">Web Development</h1>
      </header>
      <p className="text-lg text-gray-600 dark:text-gray-300">
        From a landing page that converts to a full-stack product, I build fast,
        reliable web experiences using modern tooling.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          "Marketing & landing pages",
          "Dashboards & internal tools",
          "Full-stack web applications",
          "Performance & SEO audits",
        ].map((item) => (
          <div
            key={item}
            className="rounded-lg border border-gray-200 dark:border-gray-800 p-4 text-sm"
          >
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}
