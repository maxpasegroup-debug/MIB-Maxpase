import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, ADMIN_COOKIE_VALUE } from "@/lib/adminAuth";
import { USER_COOKIE_NAME } from "@/lib/userAuth";
import { REF_COOKIE_NAME } from "@/lib/referral";

function isMobileUserAgent(userAgent: string): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile/i.test(
    userAgent
  );
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Admin routes: require auth except /admin/login
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    if (token !== ADMIN_COOKIE_VALUE) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // User dashboard: require career user session
  if (pathname.startsWith("/dashboard")) {
    const session = request.cookies.get(USER_COOKIE_NAME)?.value;
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Capture referral: if URL has ?ref=partnerId, set cookie (do not interfere with normal users)
  const ref = request.nextUrl.searchParams.get("ref");
  if (ref && ref.trim()) {
    const res = NextResponse.next();
    res.cookies.set(REF_COOKIE_NAME, ref.trim(), {
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: "lax",
    });
    // If we would redirect below for mobile, still do it after setting cookie
    if (pathname === "/") {
      const ua = request.headers.get("user-agent") ?? "";
      if (isMobileUserAgent(ua)) {
        const redirect = NextResponse.redirect(new URL("/mobile", request.url));
        redirect.cookies.set(REF_COOKIE_NAME, ref.trim(), {
          path: "/",
          maxAge: 60 * 60 * 24 * 30,
          sameSite: "lax",
        });
        return redirect;
      }
    }
    return res;
  }

  // Only redirect the exact landing page to mobile app on mobile devices
  if (pathname === "/") {
    const ua = request.headers.get("user-agent") ?? "";
    const isMobile = isMobileUserAgent(ua);

    if (isMobile) {
      return NextResponse.redirect(new URL("/mobile", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/admin", "/admin/:path*", "/dashboard", "/dashboard/:path*", "/career-intelligence", "/career-intelligence/:path*", "/mobile", "/mobile/:path*"],
};
