import { NextResponse } from "next/server";
import { USER_COOKIE_NAME } from "@/lib/userAuth";

export async function POST() {
  const res = NextResponse.json({ success: true });
  res.cookies.set(USER_COOKIE_NAME, "", {
    path: "/",
    maxAge: 0,
  });
  return res;
}
