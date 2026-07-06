import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/adminAuth";
import { writeFile } from "@/lib/contentStore";

export const dynamic = "force-dynamic";

const ALLOWED = ["jpg", "jpeg", "png", "webp", "gif", "svg", "avif"];

/** 커버/본문 이미지 업로드 — public/images/uploads/ 에 커밋 */
export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { name?: string; data?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const name = (body.name ?? "image").toLowerCase();
  const ext = name.split(".").pop() ?? "";
  if (!ALLOWED.includes(ext)) {
    return NextResponse.json(
      { error: `지원하지 않는 형식입니다. (${ALLOWED.join(", ")})` },
      { status: 400 }
    );
  }
  if (typeof body.data !== "string" || !body.data) {
    return NextResponse.json({ error: "데이터가 없습니다." }, { status: 400 });
  }

  const buffer = Buffer.from(body.data, "base64");
  if (buffer.byteLength > 8 * 1024 * 1024) {
    return NextResponse.json(
      { error: "이미지는 8MB 이하만 업로드할 수 있습니다." },
      { status: 400 }
    );
  }

  const safeBase = name
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 40) || "image";
  const fileName = `${Date.now()}-${safeBase}.${ext}`;
  const filePath = `public/images/uploads/${fileName}`;

  await writeFile(filePath, buffer, `studio: upload image ${fileName}`);
  return NextResponse.json({ ok: true, path: `/images/uploads/${fileName}` });
}
