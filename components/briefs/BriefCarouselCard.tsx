"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import type { Brief } from "@/lib/mdx";
import { formatRelativeTime, cn } from "@/lib/utils";

/**
 * 홈 아티클 그리드 3번째 자리에 들어가는 텍스트 중심 Brief 카드.
 * 아티클 카드와 높이를 맞추기 위해 이미지 자리를 액센트 블록으로 대신하고,
 * 그 안에 요약 텍스트를 직접 노출한다. 좌우 화살표로 최신 브리프 최대
 * 5건을 훑어볼 수 있고, 원문 이동은 텍스트가 아닌 하단 버튼으로만 한다
 * (요약 텍스트 자체는 링크가 아님 — 캐러셀 탐색 중 실수로 새 탭이 열리는
 * 것을 막기 위함).
 */
export default function BriefCarouselCard({ briefs }: { briefs: Brief[] }) {
  const [index, setIndex] = useState(0);
  if (briefs.length === 0) return null;
  const brief = briefs[index];

  function go(delta: number) {
    setIndex((i) => (i + delta + briefs.length) % briefs.length);
  }

  return (
    <div className="flex flex-col">
      <div className="relative flex aspect-[4/3] w-full flex-col justify-between overflow-hidden rounded-xl bg-surface-container-low p-4">
        <div className="flex items-center justify-between">
          <span className="chip w-fit">Brief</span>
          {briefs.length > 1 && (
            <div className="flex gap-1">
              {briefs.map((b, i) => (
                <span
                  key={b.slug}
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    i === index ? "bg-on-surface" : "bg-on-surface/25",
                  )}
                />
              ))}
            </div>
          )}
        </div>

        <p className="line-clamp-5 min-h-0 text-[13.5px] leading-relaxed text-on-surface">
          {brief.content.trim()}
        </p>

        <div className="flex items-center justify-between gap-2">
          {briefs.length > 1 ? (
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="이전 브리프"
              className="bg-on-surface/10 hover:bg-on-surface/15 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-on-surface transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
          ) : (
            <span />
          )}

          <a
            href={brief.link || "/briefs"}
            target={brief.link ? "_blank" : undefined}
            rel={brief.link ? "noopener noreferrer" : undefined}
            className="decoration-on-surface/40 inline-flex items-center gap-1 text-[12px] font-semibold text-on-surface underline decoration-2 underline-offset-4 transition-opacity hover:opacity-70"
          >
            원문 보러가기 <ArrowUpRight size={13} />
          </a>

          {briefs.length > 1 ? (
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="다음 브리프"
              className="bg-on-surface/10 hover:bg-on-surface/15 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-on-surface transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          ) : (
            <span />
          )}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <span className="chip">{formatRelativeTime(brief.date)}</span>
        {brief.source && <span className="chip">{brief.source}</span>}
      </div>
    </div>
  );
}
