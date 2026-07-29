"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Brief } from "@/lib/mdx";
import { formatRelativeTime, cn } from "@/lib/utils";

/**
 * 홈 아티클 그리드 3번째 자리에 들어가는 텍스트 중심 Brief 카드.
 * 아티클 카드와 높이를 맞추기 위해 이미지 자리를 액센트 블록으로 대신하고,
 * 좌우 화살표로 최신 브리프 최대 5건을 훑어볼 수 있다. 카드 클릭은 원문
 * 기사로 이동하고, 화살표는 별도 버튼이라 이동을 가로채지 않는다.
 */
export default function BriefCarouselCard({ briefs }: { briefs: Brief[] }) {
  const [index, setIndex] = useState(0);
  if (briefs.length === 0) return null;
  const brief = briefs[index];

  function go(delta: number) {
    setIndex((i) => (i + delta + briefs.length) % briefs.length);
  }

  return (
    <div className="group flex flex-col">
      <div className="relative flex aspect-[4/3] w-full flex-col justify-between overflow-hidden rounded-xl bg-accent p-4">
        <span className="chip chip-on-accent w-fit">Brief</span>

        {briefs.length > 1 && (
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="이전 브리프"
              className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="flex gap-1">
              {briefs.map((b, i) => (
                <span
                  key={b.slug}
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    i === index ? "bg-white" : "bg-white/35",
                  )}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="다음 브리프"
              className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <span className="chip">{formatRelativeTime(brief.date)}</span>
        {brief.source && <span className="chip">{brief.source}</span>}
      </div>
      <a
        href={brief.link || "/briefs"}
        target={brief.link ? "_blank" : undefined}
        rel={brief.link ? "noopener noreferrer" : undefined}
        className="mt-2 line-clamp-3 font-headline text-[15px] font-bold leading-snug tracking-tight text-on-surface transition-colors hover:text-accent"
      >
        {brief.excerpt}
      </a>
    </div>
  );
}
