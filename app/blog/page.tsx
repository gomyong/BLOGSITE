import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import {
  filterPosts,
  getAllCategories,
  getAllTags,
  getTopTags,
} from "@/lib/posts";
import { formatDate } from "@/lib/utils";
import FilterBar from "@/components/blog/FilterBar";
import FadeIn from "@/components/motion/FadeIn";

export const metadata: Metadata = {
  title: "Archive",
  description: "카테고리·태그·검색어로 탐색하는 전체 에세이 아카이브.",
};

interface SearchParams {
  category?: string;
  tags?: string;
  q?: string;
}

/**
 * PRD 3.3 — 다차원 검색/필터.
 * 필터 상태는 전부 URL 쿼리 스트링(/blog?category=&tags=&q=)에 매핑되어
 * 검색 결과 상태 그대로 링크 복사·공유가 가능하다.
 */
export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const category = params.category || undefined;
  const tags = params.tags ? params.tags.split(",").filter(Boolean) : [];
  const q = params.q || undefined;

  const posts = filterPosts({ category, tags, q });
  const isFiltered = Boolean(category || tags.length > 0 || q);

  return (
    <div className="mx-auto max-w-shell px-6 md:px-10">
      <section className="py-16 md:py-24">
        <h1 className="text-4xl font-bold tracking-tight leading-[1.15] text-neutral-900 md:text-5xl dark:text-neutral-50">
          Archive
        </h1>
        <p className="mt-6 text-neutral-500 dark:text-neutral-400">
          {isFiltered
            ? `${posts.length}개의 결과`
            : `${posts.length}개의 에세이`}
        </p>
      </section>

      <Suspense>
        <FilterBar
          categories={getAllCategories()}
          allTags={getAllTags()}
          selectedCategory={category ?? null}
          selectedTags={tags}
          query={q ?? ""}
        />
      </Suspense>

      <section className="pb-24">
        {posts.length > 0 ? (
          <div className="flex flex-col">
            {posts.map((post, i) => (
              <FadeIn key={post.slug} delay={Math.min(i, 5) * 0.05}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group grid gap-3 border-b border-neutral-100 py-10 md:grid-cols-[160px_1fr] md:gap-12 dark:border-neutral-900"
                >
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500">
                    {post.category}
                  </p>
                  <div>
                    <h2 className="text-xl font-bold tracking-tight leading-snug text-neutral-900 transition-colors group-hover:text-neutral-500 md:text-2xl dark:text-neutral-50 dark:group-hover:text-neutral-400">
                      {post.title}
                    </h2>
                    <p className="mt-3 max-w-2xl leading-[1.8] text-neutral-500 dark:text-neutral-400">
                      {post.summary}
                    </p>
                    <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-neutral-400 dark:text-neutral-500">
                      <span>
                        {formatDate(post.date)} · {post.readingTime}분 읽기
                      </span>
                      <span className="flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                          <span key={tag}>#{tag}</span>
                        ))}
                      </span>
                    </div>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </section>
    </div>
  );
}

/** PRD 3.3 — Empty State UX: 추천 태그 5개를 칩으로 큐레이션 */
function EmptyState() {
  const topTags = getTopTags(5);
  return (
    <div className="border-t border-neutral-100 py-24 text-center dark:border-neutral-900">
      <p className="text-lg text-neutral-500 dark:text-neutral-400">
        찾으시는 맥락의 글이 아직 없네요. 이런 주제는 어떠세요?
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        {topTags.map((tag) => (
          <Link
            key={tag}
            href={`/blog?tags=${encodeURIComponent(tag)}`}
            className="rounded-full border border-neutral-200 px-5 py-2 text-sm text-neutral-600 transition-colors hover:border-neutral-900 hover:text-neutral-900 dark:border-neutral-800 dark:text-neutral-400 dark:hover:border-neutral-100 dark:hover:text-neutral-50"
          >
            #{tag}
          </Link>
        ))}
      </div>
    </div>
  );
}
