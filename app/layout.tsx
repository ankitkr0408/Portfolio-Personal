import type { Metadata } from "next";
import "./globals.css";
import { getContent } from "@/lib/content";
import { siteUrl } from "@/lib/data";

export async function generateMetadata(): Promise<Metadata> {
  const { brandNames } = await getContent();
  return {
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
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Iceberg&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
