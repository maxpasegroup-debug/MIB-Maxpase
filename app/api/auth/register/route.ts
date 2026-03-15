import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { USER_COOKIE_NAME } from "@/lib/userAuth";

const SALT_ROUNDS = 10;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, role }: {
      name?: string;
      email?: string;
      password?: string;
      role?: string;
    } = body;

    if (!name?.trim() || !email?.trim() || !password || !role) {
      return NextResponse.json(
        { error: "Missing name, email, password, or role" },
        { status: 400 }
      );
    }

    const allowedRoles = [
      "student", "parent", "teacher", "school", "college", "counselor", "psychologist",
      "corporate_professional", "job_seeker", "career_switcher", "trainer", "institution", "other",
    ];
    const roleNormalized = String(role).toLowerCase().replace(/\s+/g, "_");
    if (!allowedRoles.includes(roleNormalized)) {
      return NextResponse.json(
        { error: "Invalid role" },
        { status: 400 }
      );
    }

    const existing = await prisma.careerUser.findUnique({
      where: { email: email.trim().toLowerCase() },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await prisma.careerUser.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: hashed,
        role: roleNormalized,
      },
    });

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
    console.error("[POST /api/auth/register]", e);
    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    );
  }
}
