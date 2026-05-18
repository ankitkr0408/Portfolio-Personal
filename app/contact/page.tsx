import Link from "next/link";

export const metadata = { title: "Contact" };

const EMAIL = "ankit75kumar3e@gmail.com";

export default function ContactPage() {
  return (
    <section className="space-y-8 max-w-2xl">
      <header className="space-y-3">
        <h1 className="text-4xl font-bold tracking-tight">Contact</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          The fastest way to reach me is email. Tell me a bit about what
          you&apos;re building or hiring for and I&apos;ll reply within 48
          hours.
        </p>
      </header>

      <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-gray-500">
            Email
          </p>
          <a
            href={`mailto:${EMAIL}`}
            className="text-lg font-medium underline underline-offset-4 break-all"
          >
            {EMAIL}
          </a>
        </div>
        <div className="flex flex-wrap gap-3 pt-2">
          <a
            href={`mailto:${EMAIL}?subject=Project%20inquiry`}
            className="rounded-md bg-foreground text-background px-4 py-2 text-sm font-medium hover:opacity-90"
          >
            Start a project
          </a>
          <Link
            href="/freelance"
            className="rounded-md border border-gray-300 dark:border-gray-700 px-4 py-2 text-sm font-medium hover:border-gray-500"
          >
            See freelance details
          </Link>
        </div>
      </div>
    </section>
  );
}
