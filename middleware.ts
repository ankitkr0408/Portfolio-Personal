import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/admin/auth";

export const config = { matcher: ["/admin/:path*"] };

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const ok = await verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value);
  let res: NextResponse;
  if (!ok && pathname !== "/admin/login") {
    res = NextResponse.redirect(new URL("/admin/login", req.url));
  } else if (ok && pathname === "/admin/login") {
    res = NextResponse.redirect(new URL("/admin", req.url));
  } else {
    res = NextResponse.next();
  }
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  res.headers.set("Cache-Control", "no-store");
  return res;
}
