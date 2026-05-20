import Link from "next/link";
import SplineRobot from "@/components/SplineRobot";
import HamburgerDrawer from "@/components/HamburgerDrawer";

const BOTTOM_NAV = [
  { href: "/services", label: "Services" },
  { href: "/", label: "Home" },
  { href: "/contact", label: "Contact" },
];

export default function LandingPage() {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-black text-white">
      <SplineRobot />

      <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-6">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-pink-500 to-rose-600 font-bold text-white">
            A
          </span>
          <span className="font-semibold tracking-tight text-white">
            Ankit Kumar
          </span>
        </Link>
        <HamburgerDrawer />
      </header>

      <nav className="absolute bottom-0 left-0 right-0 z-20 p-6">
        <ul className="mx-auto flex w-full max-w-md items-center justify-between gap-4">
          {BOTTOM_NAV.map((item) => (
            <li key={item.label} className="flex-1">
              <Link
                href={item.href}
                className="block rounded-full border border-white/20 bg-black/40 px-4 py-2.5 text-center text-sm font-medium text-white backdrop-blur transition hover:bg-white/10"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
