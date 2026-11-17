import { profile } from "@/lib/data";

async function getUser() {
  try {
    const r = await fetch(`https://api.github.com/users/${profile.github}`, {
      next: { revalidate: 3600 },
    });
    if (!r.ok) return null;
    return (await r.json()) as { public_repos: number; followers: number; following: number };
  } catch {
    return null;
  }
}

export default async function GithubStats() {
  const u = await getUser();
  const stats = [
    { label: "Public repos", value: u?.public_repos ?? "—" },
    { label: "Followers", value: u?.followers ?? "—" },
    { label: "Following", value: u?.following ?? "—" },
  ];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-white/10 bg-neutral-950 p-6">
            <p className="font-serif text-4xl italic">{s.value}</p>
            <p className="mt-1 text-sm text-neutral-400">{s.label}</p>
          </div>
        ))}
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://github-readme-streak-stats.herokuapp.com/?user=${profile.github}&theme=dark&background=0A0A0A&hide_border=true`}
        alt="GitHub streak"
        className="w-full max-w-xl"
      />
      <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="inline-block text-sm underline underline-offset-4">
        View GitHub profile →
      </a>
    </div>
  );
}
