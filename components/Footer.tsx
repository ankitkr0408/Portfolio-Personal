import Link from "next/link";
import { profile } from "@/lib/data";

const links = [
  ["/about", "About"], ["/projects", "Projects"], ["/services", "Services"], ["/impact", "Impact"],
  ["/freelance", "Freelance"], ["/experience", "Experience"], ["/skills", "Skills"], ["/github", "GitHub"],
  ["/mentoring", "Mentoring"], ["/blog", "Blog"], ["/contact", "Contact"],
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-neutral-950">
      <div className="mx-auto max-w-6xl space-y-4 px-6 pb-36 pt-8 text-sm text-neutral-500">
        <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2">
          {links.map(([href, label]) => <Link key={href} href={href} className="hover:text-white">{label}</Link>)}
        </nav>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span>© {new Date().getFullYear()} {profile.name}</span>
          <a href={`mailto:${profile.email}`} className="hover:text-white">{profile.email}</a>
        </div>
      </div>
    </footer>
  );
}
