export const metadata = { title: "Consulting" };

export default function ConsultingPage() {
  return (
    <section className="space-y-6 max-w-3xl">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-wider text-gray-500">Service</p>
        <h1 className="text-4xl font-bold tracking-tight">Consulting</h1>
      </header>
      <p className="text-lg text-gray-600 dark:text-gray-300">
        Technical strategy and hands-on advisory — unblock teams, validate
        architecture decisions, and ship faster.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          "Architecture & code reviews",
          "Tech-stack selection",
          "Team upskilling & process",
          "AI / automation opportunities",
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
