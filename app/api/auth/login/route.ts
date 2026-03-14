import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { USER_COOKIE_NAME } from "@/lib/userAuth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password }: { email?: string; password?: string } = body;

    if (!email?.trim() || !password) {
      return NextResponse.json(
        { error: "Missing email or password" },
        { status: 400 }
      );
    }

    const user = await prisma.careerUser.findUnique({
      where: { email: email.trim().toLowerCase() },
    });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const session = {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
    const cookieValue = encodeURIComponent(JSON.stringify(session));

    const res = NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
    res.cookies.set(USER_COOKIE_NAME, cookieValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return res;
  } catch (e) {
    console.error("[POST /api/auth/login]", e);
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}
