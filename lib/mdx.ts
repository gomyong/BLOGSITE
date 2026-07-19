import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { extractExcerpt } from "./utils";

const CONTENT_DIR = path.join(process.cwd(), "content");

export interface InsightMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  updated: string;
  category: string;
  tags: string[];
  coverImage: string;
  featured: boolean;
  author: string;
  readingTime: number;
}

export interface Insight extends InsightMeta {
  content: string;
}

export interface Brief {
  slug: string;
  date: string;
  tags: string[];
  link?: string;
  source?: string;
  automated?: boolean;
  content: string;
  excerpt: string;
}

function readMdxFiles(dir: string) {
  const fullPath = path.join(CONTENT_DIR, dir);
  if (!fs.existsSync(fullPath)) return [];
  return fs.readdirSync(fullPath).filter((f) => f.endsWith(".mdx"));
}

/** 분당 500자(한글) 기준 예상 읽기 시간 계산 */
function estimateReadingTime(content: string) {
  const chars = content.replace(/\s/g, "").length;
  return Math.max(1, Math.round(chars / 500));
}

/** 모든 Insights(심층 아티클)를 최신순으로 반환 — draft: true는 제외 */
export function getInsights(): Insight[] {
  return readMdxFiles("insights")
    .filter((file) => {
      const raw = fs.readFileSync(
        path.join(CONTENT_DIR, "insights", file),
        "utf-8"
      );
      return !matter(raw).data.draft;
    })
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const raw = fs.readFileSync(
        path.join(CONTENT_DIR, "insights", file),
        "utf-8"
      );
      const { data, content } = matter(raw);
      return {
        slug,
        title: data.title ?? slug,
        description: data.description ?? extractExcerpt(content, 160),
        date: data.date ?? "1970-01-01",
        updated: data.updated ?? data.date ?? "1970-01-01",
        category: data.category ?? "General",
        tags: data.tags ?? [],
        coverImage: data.coverImage ?? "",
        featured: data.featured ?? false,
        author: data.author ?? "에디터",
        readingTime: estimateReadingTime(content),
        content,
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

/** featured: true 아티클만 반환 (메인 Hero 영역용) */
export function getFeaturedInsights(limit = 3): Insight[] {
  return getInsights().filter((i) => i.featured).slice(0, limit);
}

/** slug로 단일 Insight 조회 */
export function getInsightBySlug(slug: string): Insight | undefined {
  return getInsights().find((i) => i.slug === slug);
}

/** 이전 글 / 다음 글 탐색 */
export function getAdjacentInsights(slug: string): {
  prev: InsightMeta | null;
  next: InsightMeta | null;
} {
  const insights = getInsights();
  const index = insights.findIndex((i) => i.slug === slug);
  if (index === -1) return { prev: null, next: null };
  return {
    // 최신순 정렬이므로 index+1이 이전(더 오래된) 글
    prev: insights[index + 1] ?? null,
    next: insights[index - 1] ?? null,
  };
}

/** 모든 Briefs(단신)를 최신순으로 반환. 제목이 없으므로 본문 첫 100자를 발췌로 사용 */
export function getBriefs(): Brief[] {
  return readMdxFiles("briefs")
    .filter((file) => {
      const raw = fs.readFileSync(
        path.join(CONTENT_DIR, "briefs", file),
        "utf-8"
      );
      return !matter(raw).data.draft;
    })
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const raw = fs.readFileSync(
        path.join(CONTENT_DIR, "briefs", file),
        "utf-8"
      );
      const { data, content } = matter(raw);
      return {
        slug,
        date:
          data.date instanceof Date
            ? data.date.toISOString()
            : String(data.date ?? "1970-01-01T00:00:00Z"),
        tags: data.tags ?? [],
        link: data.link,
        source: data.source,
        automated: data.automated ?? false,
        content,
        excerpt: extractExcerpt(content, 100),
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}
