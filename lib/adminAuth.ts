import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "studio_session";

/** ADMIN_PASSWORD 환경변수가 설정되어야 스튜디오가 활성화된다. */
export function isStudioEnabled() {
  return Boolean(process.env.ADMIN_PASSWORD);
}

/** 비밀번호에서 파생한 고정 세션 토큰 (1인 운영 블로그용 단순 인증) */
export function sessionToken() {
  const password = process.env.ADMIN_PASSWORD ?? "";
  return createHmac("sha256", password).update("studio-session-v1").digest("hex");
}

export function verifyPassword(input: string) {
  const expected = process.env.ADMIN_PASSWORD ?? "";
  if (!expected) return false;
  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** 요청 쿠키의 세션 토큰 검증 (서버 컴포넌트/라우트 핸들러 공용) */
export async function isAuthenticated() {
  if (!isStudioEnabled()) return false;
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return false;
  const expected = sessionToken();
  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
