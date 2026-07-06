import { NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  isStudioEnabled,
  sessionToken,
  verifyPassword,
} from "@/lib/adminAuth";

export async function POST(request: Request) {
  if (!isStudioEnabled()) {
    return NextResponse.json(
      { error: "스튜디오가 비활성화되어 있습니다. ADMIN_PASSWORD 환경변수를 설정하세요." },
      { status: 503 }
    );
  }

  let password: unknown;
  try {
    ({ password } = await request.json());
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  if (typeof password !== "string" || !verifyPassword(password)) {
    return NextResponse.json(
      { error: "비밀번호가 올바르지 않습니다." },
      { status: 401 }
    );
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, sessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30일
  });
  return res;
}
