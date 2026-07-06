import { NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * 뉴스레터 구독 엔드포인트.
 * RESEND_API_KEY + RESEND_AUDIENCE_ID 환경변수가 설정되면 Resend Audience에
 * 구독자를 등록하고, 없으면 데모 모드로 성공 응답만 반환한다.
 */
export async function POST(request: Request) {
  let email: unknown;
  try {
    ({ email } = await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (typeof email !== "string" || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;

  if (apiKey && audienceId) {
    const res = await fetch(
      `https://api.resend.com/audiences/${audienceId}/contacts`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, unsubscribed: false }),
      }
    );
    if (!res.ok) {
      return NextResponse.json(
        { error: "Subscription failed" },
        { status: 502 }
      );
    }
  } else {
    // 데모 모드: 외부 서비스 미연동 시 로그만 남긴다.
    console.log(`[newsletter] demo subscribe: ${email}`);
  }

  return NextResponse.json({ ok: true });
}
