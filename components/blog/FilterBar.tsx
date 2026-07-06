"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface FilterBarProps {
  categories: string[];
  allTags: string[];
  selectedCategory: string | null;
  selectedTags: string[];
  query: string;
}

/**
 * PRD 3.3 — [카테고리(단일)] + [태그(다중)] + [검색어] 3진 매트릭스 필터.
 * 모든 상태 변경은 URL 쿼리 스트링으로 즉시 반영되고(useRouter.replace),
 * 검색어 입력은 300ms 디바운스로 불필요한 요청을 막는다.
 */
export default function FilterBar({
  categories,
  allTags,
  selectedCategory,
  selectedTags,
  query,
}: FilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [searchInput, setSearchInput] = useState(query);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const navigate = useCallback(
    (next: { category?: string | null; tags?: string[]; q?: string }) => {
      const params = new URLSearchParams();
      const category =
        next.category !== undefined ? next.category : selectedCategory;
      const tags = next.tags !== undefined ? next.tags : selectedTags;
      const q = next.q !== undefined ? next.q : query;

      if (category) params.set("category", category);
      if (tags.length > 0) params.set("tags", tags.join(","));
      if (q.trim()) params.set("q", q.trim());

      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname, selectedCategory, selectedTags, query]
  );

  // Instant Search — 300ms 타이핑 유예 후 URL 반영
  useEffect(() => {
    if (searchInput === query) return;
    debounceRef.current = setTimeout(() => navigate({ q: searchInput }), 300);
    return () => clearTimeout(debounceRef.current);
  }, [searchInput, query, navigate]);

  function toggleCategory(cat: string) {
    navigate({ category: selectedCategory === cat ? null : cat });
  }

  function toggleTag(tag: string) {
    navigate({
      tags: selectedTags.includes(tag)
        ? selectedTags.filter((t) => t !== tag)
        : [...selectedTags, tag],
    });
  }

  const isFiltered =
    Boolean(selectedCategory) || selectedTags.length > 0 || Boolean(query);

  return (
    <div className="mb-16 flex flex-col gap-8 border-y border-neutral-100 py-8 dark:border-neutral-900">
      {/* 검색어 */}
      <input
        type="search"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="검색어를 입력하세요"
        aria-label="검색"
        className="w-full max-w-md border-b border-neutral-200 bg-transparent pb-2 text-lg text-neutral-900 outline-none transition-colors placeholder:text-neutral-300 focus:border-neutral-900 dark:border-neutral-800 dark:text-neutral-50 dark:placeholder:text-neutral-600 dark:focus:border-neutral-100"
      />

      {/* 카테고리 — 단일 선택 */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="mr-2 text-xs font-medium uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500">
          Category
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => toggleCategory(cat)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm transition-colors",
              selectedCategory === cat
                ? "border-neutral-900 bg-neutral-900 text-white dark:border-neutral-50 dark:bg-neutral-50 dark:text-neutral-950"
                : "border-neutral-200 text-neutral-600 hover:border-neutral-900 hover:text-neutral-900 dark:border-neutral-800 dark:text-neutral-400 dark:hover:border-neutral-100 dark:hover:text-neutral-50"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 태그 — 다중 선택 */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="mr-2 text-xs font-medium uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500">
          Tags
        </span>
        {allTags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => toggleTag(tag)}
            className={cn(
              "text-sm transition-colors",
              selectedTags.includes(tag)
                ? "font-semibold text-neutral-900 underline underline-offset-4 dark:text-neutral-50"
                : "text-neutral-400 hover:text-neutral-900 dark:text-neutral-500 dark:hover:text-neutral-50"
            )}
          >
            #{tag}
          </button>
        ))}
        {isFiltered && (
          <button
            type="button"
            onClick={() => {
              setSearchInput("");
              router.replace(pathname, { scroll: false });
            }}
            className="ml-auto text-sm text-neutral-400 underline underline-offset-4 hover:text-neutral-900 dark:hover:text-neutral-50"
          >
            초기화
          </button>
        )}
      </div>
    </div>
  );
}
