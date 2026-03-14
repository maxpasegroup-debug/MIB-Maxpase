import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, ADMIN_COOKIE_VALUE } from "@/lib/adminAuth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password }: { email?: string; password?: string } = body;

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      return NextResponse.json(
        { error: "Admin login is not configured" },
        { status: 503 }
      );
    }

    if (!email || !password || email.trim() !== adminEmail || password !== adminPassword) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const res = NextResponse.json({ success: true });
    res.cookies.set(ADMIN_COOKIE_NAME, ADMIN_COOKIE_VALUE, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return res;
  } catch (e) {
    console.error("[POST /api/admin/login]", e);
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}
