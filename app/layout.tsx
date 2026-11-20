import type { Metadata } from "next";
import "./globals.css";
import IntroOverlay from "@/components/IntroOverlay";
import SiteChrome from "@/components/SiteChrome";
import ChatBot from "@/components/ChatBot";
import { brandNames, profile, siteUrl } from "@/lib/data";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Ankit Kumar (ankit.aitalks) — Full-Stack AI Engineer",
    template: "%s | Ankit Kumar",
  },
  description:
    "I build it, automate it with AI, and keep it running. Freelance full-stack AI engineer: web, mobile, AI and cloud.",
  keywords: [...brandNames, "Ankit Kumar", "full-stack AI engineer", "freelance developer", "AI automation", "AWS DevOps"],
  authors: [{ name: "Ankit Kumar", url: siteUrl }],
  creator: "Ankit Kumar",
  openGraph: { type: "website", siteName: "Ankit Kumar", url: siteUrl },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
};

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Iceberg&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <IntroOverlay />
        <SiteChrome>{children}</SiteChrome>
        <ChatBot />
      </body>
    </html>
  );
}
