import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserSession } from "@/lib/userAuth";

export async function GET(request: Request) {
  const session = getUserSession(request);
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const user = await prisma.careerUser.findUnique({
    where: { id: session.userId },
    select: { id: true, name: true, email: true, role: true },
  });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PATCH(request: Request) {
  const session = getUserSession(request);
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json();
  const { name }: { name?: string } = body;

  if (!name || typeof name !== "string" || !name.trim()) {
    return NextResponse.json(
      { error: "Name is required" },
      { status: 400 }
    );
  }

  const user = await prisma.careerUser.update({
    where: { id: session.userId },
    data: { name: name.trim() },
    select: { id: true, name: true, email: true, role: true },
  });

  return NextResponse.json(user);
}
