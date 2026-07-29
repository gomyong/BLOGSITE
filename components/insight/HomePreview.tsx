import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { InsightMeta, Brief } from "@/lib/mdx";
import { ArticleCard } from "@/components/insight/HomeFeed";
import BriefCarouselCard from "@/components/briefs/BriefCarouselCard";

/**
 * 홈 전용 미리보기 그리드 — 아티클 카드 2개 + Brief 캐러셀 카드 1개(3번째 자리).
 * 데스크톱(3열)에서는 소스 순서 그대로 3번째 칸에 Brief가 오고, 모바일(1열)에서는
 * order-first로 맨 위에 오도록 한다. 전체 목록은 /articles에서 확인한다.
 */
export default function HomePreview({
  insights,
  briefs,
}: {
  insights: InsightMeta[];
  briefs: Brief[];
}) {
  return (
    <section>
      <div className="mb-lg flex items-end justify-between">
        <div>
          <h2 className="font-headline text-[24px] font-extrabold tracking-tight text-on-surface">
            Articles
          </h2>
          <p className="mt-1 text-[14px] text-on-surface-variant">
            기술과 브랜드, 그 사이의 이야기들
          </p>
        </div>
        <Link
          href="/articles"
          className="hidden items-center gap-1 text-[13px] font-medium text-on-surface-variant transition-colors hover:text-accent sm:flex"
        >
          모든 아티클 보기 <ArrowRight size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-x-lg gap-y-xl sm:grid-cols-2 lg:grid-cols-3">
        {insights.map((insight) => (
          <ArticleCard key={insight.slug} insight={insight} />
        ))}
        <div className="order-first lg:order-none">
          <BriefCarouselCard briefs={briefs} />
        </div>
      </div>

      <Link
        href="/articles"
        className="mt-lg flex items-center justify-center gap-1 text-[13px] font-medium text-on-surface-variant transition-colors hover:text-accent sm:hidden"
      >
        모든 아티클 보기 <ArrowRight size={14} />
      </Link>
    </section>
  );
}
