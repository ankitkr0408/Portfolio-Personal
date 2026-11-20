"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Dock from "./Dock";
import Footer from "./Footer";
import type { Profile } from "@/lib/data";

export default function SiteChrome({ profile, children }: { profile: Profile; children: React.ReactNode }) {
  const pathname = usePathname();
  const isLanding = pathname === "/";

  if (isLanding) {
    return (
      <>
        {children}
        <Dock profile={profile} />
      </>
    );
  }

  return (
    <>
      <header className="mx-auto w-full max-w-6xl px-6 pt-6">
        <Link href="/" className="inline-flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-pink-500 to-rose-600 font-bold text-white">A</span>
          <span className="font-semibold tracking-tight">{profile.name}</span>
        </Link>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12">{children}</main>
      <Footer profile={profile} />
      <Dock profile={profile} />
    </>
  );
}
