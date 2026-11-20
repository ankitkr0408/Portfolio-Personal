import { getContent } from "@/lib/content";

export default async function ExperienceTimeline() {
  const { experience } = await getContent();
  return (
    <ol className="relative space-y-10 border-l border-white/15 pl-8">
      {experience.map((j) => (
        <li key={j.company} className="relative">
          <span
            className={`absolute -left-[37px] top-2 h-3 w-3 rounded-full ${
              j.current ? "bg-rose-500" : "bg-neutral-600"
            }`}
          />
          <p className="text-xs uppercase tracking-widest text-neutral-500">
            {j.period} · {j.place}
          </p>
          <h3 className="mt-1 text-xl font-semibold">
            {j.role} <span className="text-neutral-400">@ {j.company}</span>
          </h3>
          <ul className="mt-3 space-y-1.5 text-neutral-400">
            {j.points.map((p) => (
              <li key={p}>— {p}</li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}
