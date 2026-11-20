import "./day-theme.css";
import SiteChrome from "@/components/SiteChrome";
import ChatBot from "@/components/ChatBot";
import ThemeToggle, { THEME_KEY } from "@/components/ThemeToggle";
import { getContent } from "@/lib/content";
import { siteUrl } from "@/lib/data";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const content = await getContent();
  const { profile, brandNames } = content;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    alternateName: brandNames,
    jobTitle: "Full-Stack AI Engineer",
    url: siteUrl,
    email: profile.email,
    sameAs: [profile.githubUrl, profile.linkedin, profile.instagram],
  };
  return (
    <>
      {/* Runs before first paint so the saved theme never flashes (default: day) */}
      <script
        dangerouslySetInnerHTML={{
          __html: `try{var t=localStorage.getItem("${THEME_KEY}");document.documentElement.dataset.siteTheme=t==="night"?"night":"day"}catch(e){document.documentElement.dataset.siteTheme="day"}`,
        }}
      />
      {/* "<" is escaped so edited content can never close the script tag */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <SiteChrome profile={profile}>{children}</SiteChrome>
      <ChatBot content={content} />
      <ThemeToggle />
    </>
  );
}
