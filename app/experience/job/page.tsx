export const metadata = { title: "Full-Time Roles" };

export default function JobPage() {
  return (
    <section className="space-y-6 max-w-3xl">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-wider text-gray-500">
          Experience
        </p>
        <h1 className="text-4xl font-bold tracking-tight">Full-Time Roles</h1>
      </header>
      <p className="text-lg text-gray-600 dark:text-gray-300">
        Full-time positions, the products I built, and the outcomes I drove.
      </p>
      <ol className="space-y-4">
        <li className="rounded-lg border border-gray-200 dark:border-gray-800 p-5">
          <h3 className="font-semibold">Role title — Company</h3>
          <p className="text-sm text-gray-500">Dates · Location</p>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
            Short description of what you owned and the impact you had.
          </p>
        </li>
      </ol>
    </section>
  );
}
