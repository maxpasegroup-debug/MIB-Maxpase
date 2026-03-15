import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, ADMIN_COOKIE_VALUE } from "@/lib/adminAuth";
import { USER_COOKIE_NAME } from "@/lib/userAuth";
import { REF_COOKIE_NAME } from "@/lib/referral";

const WHATS_NEXT = "/whats-next";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Platform lives under /whats-next; only protect those routes
  if (!pathname.startsWith(WHATS_NEXT)) {
    // Capture referral on any page
    const ref = request.nextUrl.searchParams.get("ref");
    if (ref && ref.trim()) {
      const res = NextResponse.next();
      res.cookies.set(REF_COOKIE_NAME, ref.trim(), {
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
        sameSite: "lax",
      });
      return res;
    }
    return NextResponse.next();
  }

  // Admin routes: require auth except /whats-next/admin/login
  if (pathname.startsWith(`${WHATS_NEXT}/admin`) && !pathname.startsWith(`${WHATS_NEXT}/admin/login`)) {
    const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    if (token !== ADMIN_COOKIE_VALUE) {
      return NextResponse.redirect(new URL(`${WHATS_NEXT}/admin/login`, request.url));
    }
  }

  // User dashboard: require career user session
  if (pathname.startsWith(`${WHATS_NEXT}/dashboard`)) {
    const session = request.cookies.get(USER_COOKIE_NAME)?.value;
    if (!session) {
      return NextResponse.redirect(new URL(`${WHATS_NEXT}/login`, request.url));
    }
  }

  // Capture referral
  const ref = request.nextUrl.searchParams.get("ref");
  if (ref && ref.trim()) {
    const res = NextResponse.next();
    res.cookies.set(REF_COOKIE_NAME, ref.trim(), {
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      sameSite: "lax",
    });
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/whats-next",
    "/whats-next/admin",
    "/whats-next/admin/:path*",
    "/whats-next/dashboard",
    "/whats-next/dashboard/:path*",
    "/whats-next/career-intelligence",
    "/whats-next/career-intelligence/:path*",
    "/whats-next/mobile",
    "/whats-next/mobile/:path*",
    "/whats-next/login",
    "/whats-next/partners",
    "/whats-next/partners/:path*",
  ],
};
