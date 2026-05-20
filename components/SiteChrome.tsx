"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLanding = pathname === "/";

  if (isLanding) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-10">
        {children}
      </main>
      <Footer />
    </>
  );
}
