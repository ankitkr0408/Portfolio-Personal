import type { Metadata } from "next";
import "./globals.css";
import IntroOverlay from "@/components/IntroOverlay";
import SiteChrome from "@/components/SiteChrome";

export const metadata: Metadata = {
  title: "Ankit Kumar — Portfolio",
  description: "Personal portfolio: projects, services, and writing.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <IntroOverlay />
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
