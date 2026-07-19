import { NextResponse } from "next/server";
import matter from "gray-matter";
import { isAuthenticated } from "@/lib/adminAuth";
import { readFile, deleteFile, writeFile } from "@/lib/contentStore";

export const dynamic = "force-dynamic";

const DIRS = { insight: "content/insights", brief: "content/briefs" } as const;

interface Params {
  params: Promise<{ type: string; slug: string }>;
}

function resolvePath(type: string, slug: string) {
  const dir = DIRS[type as keyof typeof DIRS];
  if (!dir || !/^[a-z0-9-]+$/.test(slug)) return null;
  return `${dir}/${slug}.mdx`;
}

/** 단일 글 조회 (에디터 로딩용) */
export async function GET(_request: Request, { params }: Params) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { type, slug } = await params;
  const filePath = resolvePath(type, slug);
  if (!filePath) {
    return NextResponse.json({ error: "잘못된 경로입니다." }, { status: 400 });
  }
  const raw = await readFile(filePath);
  if (!raw) {
    return NextResponse.json({ error: "글을 찾을 수 없습니다." }, { status: 404 });
  }
  const { data, content } = matter(raw);
  return NextResponse.json({ frontmatter: data, content: content.trim() });
}

/** 초안 승인 발행 — draft 플래그만 제거하고 다시 저장 (자동 브리프 승인용) */
export async function PATCH(request: Request, { params }: Params) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { type, slug } = await params;
  const filePath = resolvePath(type, slug);
  if (!filePath) {
    return NextResponse.json({ error: "잘못된 경로입니다." }, { status: 400 });
  }

  let action = "publish";
  try {
    ({ action = "publish" } = await request.json());
  } catch {
    /* 본문 없으면 기본 publish */
  }
  if (action !== "publish") {
    return NextResponse.json({ error: "지원하지 않는 동작입니다." }, { status: 400 });
  }

  const raw = await readFile(filePath);
  if (!raw) {
    return NextResponse.json({ error: "글을 찾을 수 없습니다." }, { status: 404 });
  }
  const { data, content } = matter(raw);
  if (!data.draft) {
    return NextResponse.json({ ok: true, alreadyPublished: true });
  }
  delete data.draft;
  const mdx = matter.stringify(content, data);
  await writeFile(filePath, mdx, `studio: publish draft ${type} "${slug}"`);
  return NextResponse.json({ ok: true });
}

/** 글 삭제 */
export async function DELETE(_request: Request, { params }: Params) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { type, slug } = await params;
  const filePath = resolvePath(type, slug);
  if (!filePath) {
    return NextResponse.json({ error: "잘못된 경로입니다." }, { status: 400 });
  }
  await deleteFile(filePath, `studio: delete ${type} "${slug}"`);
  return NextResponse.json({ ok: true });
}
