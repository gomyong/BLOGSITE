"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { InsightMeta } from "@/lib/mdx";
import { formatDate, cn } from "@/lib/utils";

/**
 * X-style 홈 피드 — 카테고리 필터 칩 + 풀와이드 분할 피처드 + 에디토리얼 그리드.
 * 필터는 클라이언트에서 동작하므로 페이지는 정적(SSG)으로 유지된다.
 */
export default function HomeFeed({ insights }: { insights: InsightMeta[] }) {
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(insights.map((i) => i.category)))],
    [insights]
  );
  const [active, setActive] = useState("All");

  const filtered =
    active === "All"
      ? insights
      : insights.filter((i) => i.category === active);
  const [featured, ...rest] = filtered;

  return (
    <>
      {/* 카테고리 필터 칩 */}
      <div className="flex flex-wrap items-center gap-xs border-y border-outline-variant py-sm">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActive(cat)}
            className={cn(
              "px-sm py-[6px] font-label text-label-sm uppercase transition-colors",
              active === cat
                ? "bg-on-surface text-surface"
                : "text-on-surface-variant hover:bg-surface-container-low hover:text-primary"
            )}
          >
            {cat}
          </button>
        ))}
        <span className="ml-auto hidden font-label text-label-sm text-on-surface-variant sm:block">
          {filtered.length} POSTS
        </span>
      </div>

      {/* 피처드 — 풀와이드 분할 카드 (이미지 60 / 텍스트 40) */}
      {featured && (
        <Link
          href={`/insight/${featured.slug}`}
          className="group mt-lg grid grid-cols-1 gap-md border-b border-outline-variant pb-xl md:grid-cols-5 md:gap-lg"
        >
          <div className="relative aspect-[16/10] overflow-hidden border border-outline-variant md:col-span-3">
            <Image
              src={featured.coverImage}
              alt={featured.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 640px"
              className="object-cover grayscale transition-all duration-700 group-hover:scale-[1.03] group-hover:grayscale-0"
            />
          </div>
          <div className="flex flex-col justify-between md:col-span-2">
            <div>
              <div className="flex items-center gap-xs">
                <span className="chip">{featured.category}</span>
                <span className="font-label text-label-sm text-on-surface-variant">
                  {formatDate(featured.date)}
                </span>
              </div>
              <h2 className="mt-md font-headline text-headline-lg font-bold text-on-surface transition-colors group-hover:text-primary">
                {featured.title}
              </h2>
              <p className="mt-sm line-clamp-3 text-body-md text-on-surface-variant">
                {featured.description}
              </p>
            </div>
            <span className="mt-md inline-flex items-center gap-xs font-label text-label-sm uppercase text-primary">
              기사 읽기
              <ArrowRight
                size={14}
                className="transition-transform group-hover:translate-x-1"
              />
            </span>
          </div>
        </Link>
      )}

      {/* 에디토리얼 그리드 — 2열, 헤어라인 리듬 */}
      <div className="mt-xl grid grid-cols-1 gap-x-lg gap-y-xl sm:grid-cols-2">
        {rest.map((insight) => (
          <Link
            key={insight.slug}
            href={`/insight/${insight.slug}`}
            className="group flex flex-col"
          >
            <div className="relative aspect-video w-full overflow-hidden border border-outline-variant">
              <Image
                src={insight.coverImage}
                alt={insight.title}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover grayscale transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0"
              />
            </div>
            <div className="mt-md flex items-center gap-xs">
              <span className="chip">{insight.category}</span>
              <span className="font-label text-label-sm text-on-surface-variant">
                {formatDate(insight.date)}
              </span>
            </div>
            <h3 className="mt-sm font-headline text-headline-md font-semibold text-on-surface transition-colors group-hover:text-primary">
              {insight.title}
            </h3>
            <p className="mt-xs line-clamp-2 text-body-md text-on-surface-variant">
              {insight.description}
            </p>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-xl text-center text-body-md text-on-surface-variant">
          이 카테고리에는 아직 글이 없습니다.
        </p>
      )}
    </>
  );
}
