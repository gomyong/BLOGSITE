import { NextResponse } from "next/server";
import matter from "gray-matter";
import { isAuthenticated } from "@/lib/adminAuth";
import {
  listFiles,
  readFile,
  writeFile,
  storageMode,
} from "@/lib/contentStore";

export const dynamic = "force-dynamic";

const DIRS = { insight: "content/insights", brief: "content/briefs" } as const;
type PostType = keyof typeof DIRS;

/** 스튜디오 대시보드용 글 목록 (frontmatter 요약 포함) */
export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  async function collect(type: PostType) {
    const files = await listFiles(DIRS[type]);
    const items = await Promise.all(
      files.map(async (file) => {
        const raw = await readFile(`${DIRS[type]}/${file}`);
        if (!raw) return null;
        const { data, content } = matter(raw);
        return {
          type,
          slug: file.replace(/\.mdx$/, ""),
          title:
            (data.title as string) ??
            content.trim().replace(/\s+/g, " ").slice(0, 60),
          date: String(data.date ?? ""),
          category: (data.category as string) ?? "",
          draft: Boolean(data.draft),
          featured: Boolean(data.featured),
        };
      })
    );
    return items.filter(Boolean);
  }

  const [insights, briefs] = await Promise.all([
    collect("insight"),
    collect("brief"),
  ]);
  return NextResponse.json({ insights, briefs, storage: storageMode() });
}

/** 발행/수정 — MDX 파일을 생성해 GitHub에 커밋 (커밋 → Vercel 자동 재배포) */
export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    type?: string;
    slug?: string;
    frontmatter?: Record<string, unknown>;
    content?: string;
    previousSlug?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const type = body.type as PostType;
  if (!DIRS[type]) {
    return NextResponse.json({ error: "type이 올바르지 않습니다." }, { status: 400 });
  }
  const slug = (body.slug ?? "").trim();
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json(
      { error: "슬러그는 영문 소문자, 숫자, 하이픈만 사용할 수 있습니다." },
      { status: 400 }
    );
  }
  if (typeof body.content !== "string" || !body.content.trim()) {
    return NextResponse.json({ error: "본문이 비어 있습니다." }, { status: 400 });
  }

  // 빈 값 제거 후 frontmatter 직렬화
  const fm = Object.fromEntries(
    Object.entries(body.frontmatter ?? {}).filter(
      ([, v]) => v !== "" && v !== null && v !== undefined
    )
  );
  const mdx = matter.stringify(`\n${body.content.trim()}\n`, fm);
  const filePath = `${DIRS[type]}/${slug}.mdx`;

  const title = (fm.title as string) ?? slug;
  await writeFile(filePath, mdx, `studio: publish ${type} "${title}"`);

  // 슬러그가 바뀐 수정이면 이전 파일 제거 — previousSlug도 동일한 형식 검증 필요
  // (검증 없이 경로에 그대로 쓰면 "../" 등으로 저장소의 다른 파일을 지울 수 있음)
  const previousSlug = (body.previousSlug ?? "").trim();
  if (previousSlug && /^[a-z0-9-]+$/.test(previousSlug) && previousSlug !== slug) {
    const { deleteFile } = await import("@/lib/contentStore");
    await deleteFile(
      `${DIRS[type]}/${previousSlug}.mdx`,
      `studio: rename ${previousSlug} -> ${slug}`
    );
  }

  return NextResponse.json({ ok: true, slug, storage: storageMode() });
}
