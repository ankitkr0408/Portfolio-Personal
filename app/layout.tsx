import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
        <Navbar />
        <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-10">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
