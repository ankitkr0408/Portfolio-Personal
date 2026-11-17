import { impact, linkedinPosts } from "@/lib/data";

export default function ImpactCards() {
  return (
    <div className="space-y-16">
      <div className="grid gap-6 md:grid-cols-3">
        {impact.map((i) => (
          <article key={i.title} className="overflow-hidden rounded-2xl border border-white/10 bg-neutral-950">
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={i.photo} alt={i.title} className="h-52 w-full object-cover" />
              <span className="absolute left-3 top-3 rounded-md border border-rose-500 bg-black/70 px-2 py-0.5 text-xs text-rose-400">{i.tag}</span>
              <span className="absolute right-3 top-3 rounded-md border border-white/30 bg-black/70 px-2 py-0.5 text-xs">{i.date}</span>
            </div>
            <div className="p-5">
              <h3 className="text-lg font-semibold">{i.title}</h3>
              <p className="text-sm text-sky-300">{i.org}</p>
              <p className="mt-3 text-sm text-neutral-400">{i.blurb}</p>
            </div>
          </article>
        ))}
      </div>
      <div>
        <p className="mb-5 text-xs uppercase tracking-[0.25em] text-neutral-500">What students say on LinkedIn</p>
        <div className="grid gap-4 md:grid-cols-2">
          {linkedinPosts.map((p) => (
            <a key={p.author} href={p.url} target="_blank" rel="noreferrer"
              className="rounded-2xl border border-white/10 bg-neutral-950 p-5 transition hover:border-sky-400/60">
              <p className="text-neutral-200">&ldquo;{p.text}&rdquo;</p>
              <p className="mt-3 text-sm text-neutral-500">— {p.author} · LinkedIn</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
