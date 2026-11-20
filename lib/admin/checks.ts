import type { SiteContent } from "../data";

export type Check = { level: "warn" | "info"; text: string; section: keyof SiteContent };

/** Things on the site that still look like placeholders or are easy to forget. */
export function contentChecks(c: SiteContent): Check[] {
  const out: Check[] = [];
  if (/your-handle/i.test(c.profile.linkedin)) out.push({ level: "warn", section: "profile", text: "LinkedIn URL is still the placeholder." });
  if (c.impact.some((i) => /picsum\.photos/.test(i.photo))) out.push({ level: "warn", section: "impact", text: "Impact events still use demo (picsum) photos." });
  if (c.linkedinPosts.some((p) => /^https?:\/\/(www\.)?linkedin\.com\/?$/.test(p.url))) out.push({ level: "warn", section: "linkedinPosts", text: "LinkedIn testimonials still point to the LinkedIn homepage (demo data)." });
  const current = c.experience.filter((j) => j.current).length;
  if (current !== 1) out.push({ level: "warn", section: "experience", text: current === 0 ? "No role is marked as current." : "More than one role is marked as current." });
  const featured = c.projects.filter((p) => p.featured).length;
  if (featured !== 3) out.push({ level: "info", section: "projects", text: `${featured} featured project(s); the home page is designed around 3.` });
  const noLink = c.projects.filter((p) => !p.href || p.href === "#").length;
  if (noLink) out.push({ level: "info", section: "projects", text: `${noLink} project(s) have no public link.` });
  const noSite = c.caseStudies.filter((s) => !s.href).length;
  if (noSite) out.push({ level: "info", section: "caseStudies", text: `${noSite} case study(ies) have no live-site link.` });
  for (const label of ["Typical engagement", "Working style", "Timezone"]) {
    if (!c.freelanceFacts.some((f) => f.label === label)) out.push({ level: "warn", section: "freelanceFacts", text: `Missing the "${label}" fact (the chat bot reads it).` });
  }
  return out;
}
