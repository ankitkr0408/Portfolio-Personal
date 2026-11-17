import { hats } from "@/lib/data";

export default function Hats() {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {hats.map((h) => (
        <article key={h.hat} className="group rounded-2xl border border-white/10 bg-neutral-950 p-6 transition hover:border-rose-500/60">
          <p className="text-xs uppercase tracking-[0.25em] text-rose-400">{h.hat}</p>
          <h3 className="mt-3 font-serif text-3xl italic">{h.verb}</h3>
          <p className="mt-4 text-sm text-neutral-400">{h.text}</p>
          <p className="mt-5 border-t border-white/10 pt-4 text-sm text-neutral-200">{h.proof}</p>
        </article>
      ))}
    </div>
  );
}
