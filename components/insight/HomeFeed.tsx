"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { InsightMeta } from "@/lib/mdx";
import { formatDate, cn } from "@/lib/utils";

/** CLIP 스타일 카드 — 라운드 이미지 + pill 태그 + 볼드 제목 */
function ArticleCard({ insight }: { insight: InsightMeta }) {
  return (
    <Link href={`/insight/${insight.slug}`} className="group flex flex-col">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-surface-container-low">
        <Image
          src={insight.coverImage}
          alt={insight.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover grayscale transition-all duration-500 group-hover:scale-[1.04] group-hover:grayscale-0"
        />
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <span className="chip">{insight.category}</span>
        <span className="chip">{formatDate(insight.date)}</span>
      </div>
      <h3 className="mt-2 font-headline text-[17px] font-bold leading-snug tracking-tight text-on-surface transition-colors group-hover:text-accent">
        {insight.title}
      </h3>
      <p className="mt-1.5 line-clamp-2 text-[13.5px] leading-relaxed text-on-surface-variant">
        {insight.description}
      </p>
    </Link>
  );
}

export default function HomeFeed({ insights }: { insights: InsightMeta[] }) {
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(insights.map((i) => i.category)))],
    [insights]
  );
  const [active, setActive] = useState("All");
  const filtered =
    active === "All" ? insights : insights.filter((i) => i.category === active);

  return (
    <>
      {/* 카테고리 필터 pill */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActive(cat)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors",
              active === cat
                ? "border-on-surface bg-on-surface text-surface"
                : "border-outline-variant text-on-surface-variant hover:border-on-surface hover:text-on-surface"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="mt-lg grid grid-cols-1 gap-x-lg gap-y-xl sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((insight) => (
          <ArticleCard key={insight.slug} insight={insight} />
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
