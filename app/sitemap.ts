import type { MetadataRoute } from "next";
import { getContent } from "@/lib/content";
import { siteUrl } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { caseStudies, projects, services } = await getContent();
  const fixed = ["", "/about", "/projects", "/services", "/impact", "/freelance", "/experience", "/skills", "/github", "/mentoring", "/blog", "/contact"];
  const dynamic = [
    ...projects.map((p) => `/projects/${p.slug}`),
    ...caseStudies.map((c) => `/impact/${c.slug}`),
    ...services.map((s) => `/services/${s.slug}`),
  ];
  return [...fixed, ...dynamic].map((path) => ({ url: `${siteUrl}${path}`, lastModified: new Date() }));
}
