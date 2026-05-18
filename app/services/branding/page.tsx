export const metadata = { title: "Branding" };

export default function BrandingPage() {
  return (
    <section className="space-y-6 max-w-3xl">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-wider text-gray-500">Service</p>
        <h1 className="text-4xl font-bold tracking-tight">Branding</h1>
      </header>
      <p className="text-lg text-gray-600 dark:text-gray-300">
        Visual identity and product-led brand systems — logo, type, color, and
        the landing page that ties it all together.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          "Logo & visual identity",
          "Brand systems & guidelines",
          "Landing page design",
          "Social & deck templates",
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
