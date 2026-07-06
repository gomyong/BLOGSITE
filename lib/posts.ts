import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface PostMeta {
  slug: string;
  title: string;
  summary: string;
  category: string;
  tags: string[];
  date: string;
  readingTime: number; // 분 단위, Math.ceil(전체단어수 / 200)
}

export interface Post extends PostMeta {
  content: string;
}

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

/** PRD 3.1 — 텍스트 길이 기반 예상 독서 시간(분) 계산 */
export function calcReadingTime(text: string): number {
  const words = text
    .replace(/[#>*`\-|[\]()!]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

function parsePost(filename: string): Post {
  const raw = fs.readFileSync(path.join(POSTS_DIR, filename), "utf8");
  const { data, content } = matter(raw);
  const slug = filename.replace(/\.mdx?$/, "");
  return {
    slug,
    title: data.title ?? slug,
    summary: data.summary ?? "",
    category: data.category ?? "Uncategorized",
    tags: Array.isArray(data.tags) ? data.tags : [],
    date: data.date ?? "1970-01-01",
    readingTime: calcReadingTime(content),
    content,
  };
}

export function getAllPosts(): Post[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => /\.mdx?$/.test(f))
    .map(parsePost)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string): Post | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

export function getAllCategories(): string[] {
  return [...new Set(getAllPosts().map((p) => p.category))].sort();
}

export function getAllTags(): string[] {
  return [...new Set(getAllPosts().flatMap((p) => p.tags))].sort();
}

/** PRD 3.3 — Empty State 큐레이션용: 빈도 상위 태그 N개 */
export function getTopTags(limit = 5): string[] {
  const freq = new Map<string, number>();
  for (const post of getAllPosts()) {
    for (const tag of post.tags) freq.set(tag, (freq.get(tag) ?? 0) + 1);
  }
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([tag]) => tag);
}

export interface PostFilter {
  category?: string;
  tags?: string[]; // AND 매칭 (PostgreSQL `tags @> array` 연산자와 동일 의미)
  q?: string;
}

/**
 * PRD 3.3 — [카테고리(단일)] + [태그(다중)] + [검색어] 3진 매트릭스 필터.
 * 파일 기반 스토어에서 Supabase 풀텍스트 쿼리와 동일한 의미로 동작한다.
 */
export function filterPosts({ category, tags, q }: PostFilter): Post[] {
  let posts = getAllPosts();
  if (category) posts = posts.filter((p) => p.category === category);
  if (tags && tags.length > 0)
    posts = posts.filter((p) => tags.every((t) => p.tags.includes(t)));
  if (q && q.trim()) {
    const needle = q.trim().toLowerCase();
    posts = posts.filter((p) =>
      [p.title, p.summary, p.content, p.tags.join(" ")]
        .join(" ")
        .toLowerCase()
        .includes(needle)
    );
  }
  return posts;
}
