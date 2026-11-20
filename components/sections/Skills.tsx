import { getContent } from "@/lib/content";

export default async function Skills() {
  const { skills, sites } = await getContent();
  return (
    <div className="space-y-10">
      <div className="grid gap-6 md:grid-cols-2">
        {Object.entries(skills).map(([group, items]) => (
          <div key={group} className="flex gap-4 border-b border-white/10 pb-4">
            <p className="w-36 shrink-0 text-sm text-neutral-500">{group}</p>
            <p className="text-neutral-200">{items.join(" · ")}</p>
          </div>
        ))}
      </div>
      <div>
        <p className="mb-3 text-sm text-neutral-500">Sites shipped</p>
        <div className="flex flex-wrap gap-2">
          {sites.map((s) => (
            <a key={s} href={`https://${s}`} target="_blank" rel="noreferrer"
              className="rounded-full border border-white/15 px-3 py-1 text-sm hover:bg-white/10">
              {s}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
