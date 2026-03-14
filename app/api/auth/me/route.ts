import { NextResponse } from "next/server";
import { getUserSession } from "@/lib/userAuth";
import { prisma } from "@/lib/prisma";

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

  return NextResponse.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
}
