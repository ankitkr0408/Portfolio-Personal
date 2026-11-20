import { getContent } from "@/lib/content";

export default async function ProcessSteps() {
  const { workflow } = await getContent();
  return (
    <div className="grid gap-5 md:grid-cols-4">
      {workflow.map((p) => (
        <div key={p.step} className="rounded-2xl border border-white/10 bg-neutral-950 p-6">
          <p className="font-serif text-3xl italic text-rose-400">{p.step}</p>
          <h3 className="mt-3 text-lg font-semibold">{p.title}</h3>
          <p className="mt-2 text-sm text-neutral-400">{p.text}</p>
        </div>
      ))}
    </div>
  );
}
