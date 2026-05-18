export const metadata = { title: "Mobile Apps" };

export default function MobileAppsPage() {
  return (
    <section className="space-y-6 max-w-3xl">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-wider text-gray-500">Service</p>
        <h1 className="text-4xl font-bold tracking-tight">Mobile Apps</h1>
      </header>
      <p className="text-lg text-gray-600 dark:text-gray-300">
        Cross-platform mobile apps that feel native — from MVP to App Store and
        Play Store launch.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          "iOS & Android (React Native / Flutter)",
          "Prototype → MVP → launch",
          "Push notifications & offline-first",
          "Store listing & release pipelines",
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
