import type { Metadata } from "next";
import "./globals.css";
import IntroOverlay from "@/components/IntroOverlay";
import SiteChrome from "@/components/SiteChrome";
import { profile, siteUrl } from "@/lib/data";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Ankit Kumar — Full-Stack AI Engineer",
    template: "%s | Ankit Kumar",
  },
  description:
    "I build it, automate it with AI, and keep it running. Freelance full-stack AI engineer: web, mobile, AI and cloud.",
  openGraph: { type: "website", siteName: "Ankit Kumar", url: siteUrl },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: "Full-Stack AI Engineer",
  url: siteUrl,
  email: profile.email,
  sameAs: [profile.githubUrl, profile.linkedin],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <IntroOverlay />
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
