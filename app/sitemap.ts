import type { MetadataRoute } from "next";
import { caseStudies, projects, services, siteUrl } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const fixed = ["", "/about", "/projects", "/services", "/impact", "/freelance", "/experience", "/skills", "/github", "/mentoring", "/blog", "/contact"];
  const dynamic = [
    ...projects.map((p) => `/projects/${p.slug}`),
    ...caseStudies.map((c) => `/impact/${c.slug}`),
    ...services.map((s) => `/services/${s.slug}`),
  ];
  return [...fixed, ...dynamic].map((path) => ({ url: `${siteUrl}${path}`, lastModified: new Date() }));
}
