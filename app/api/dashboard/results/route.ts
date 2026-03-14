import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserSession } from "@/lib/userAuth";

export async function GET(request: Request) {
  const session = getUserSession(request);
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const sessions = await prisma.career10DSession.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: "desc" },
    include: { report: true },
  });

  const list = sessions.map((s) => ({
    sessionId: s.id,
    date: s.createdAt,
    cluster: s.report?.cluster ?? "—",
  }));

  return NextResponse.json({ results: list });
}
