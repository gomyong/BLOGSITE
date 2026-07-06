import Link from "next/link";
import { getBriefs, getFeaturedInsights, getInsights } from "@/lib/mdx";
import FeaturedArticle from "@/components/insight/FeaturedArticle";
import SecondaryFeatured from "@/components/insight/SecondaryFeatured";
import InsightCard from "@/components/insight/InsightCard";
import BriefItem from "@/components/briefs/BriefItem";
import NewsletterForm from "@/components/layout/NewsletterForm";

export default function HomePage() {
  // 벤토 히어로에는 featured 2개만 사용, 나머지는 그리드로
  const featured = getFeaturedInsights(2);
  const featuredSlugs = new Set(featured.map((i) => i.slug));
  const insights = getInsights().filter((i) => !featuredSlugs.has(i.slug));
  const briefs = getBriefs().slice(0, 8);

  return (
    <div className="mx-auto max-w-container-max px-[20px] py-lg md:px-lg">
      {/* Featured — 벤토 스타일 히어로 (메인 셀 8열 + 보조 셀 4열) */}
      {featured.length > 0 && (
        <section
          aria-label="Featured"
          className="mb-xl grid grid-cols-1 gap-md md:grid-cols-12"
        >
          <div className="md:col-span-8">
            <FeaturedArticle insight={featured[0]} />
          </div>
          <div className="flex flex-col gap-md md:col-span-4">
            {featured[1] && <SecondaryFeatured insight={featured[1]} />}
            <div id="newsletter">
              <NewsletterForm />
            </div>
          </div>
        </section>
      )}

      <hr className="mb-xl border-outline-variant" />

      {/* Dual Layout: Insights 그리드 + Briefs 타임라인 */}
      <div className="grid gap-lg lg:grid-cols-5">
        <section aria-label="Insights" className="lg:col-span-3">
          <div className="mb-lg flex items-end justify-between">
            <h2 className="font-headline text-headline-lg font-bold text-on-surface">
              최신 발간물
            </h2>
            <span className="font-label text-label-sm uppercase text-on-surface-variant">
              Insights
            </span>
          </div>
          <div className="grid grid-cols-1 gap-lg sm:grid-cols-2">
            {insights.map((insight) => (
              <InsightCard key={insight.slug} insight={insight} />
            ))}
          </div>
        </section>

        <aside aria-label="Briefs" className="lg:col-span-2">
          <div className="mb-lg flex items-end justify-between">
            <h2 className="font-headline text-headline-lg font-bold text-on-surface">
              브리프
            </h2>
            <Link
              href="/briefs"
              className="font-label text-label-sm uppercase text-primary underline decoration-2 underline-offset-4 hover:text-primary-container"
            >
              전체 보기
            </Link>
          </div>

          <div className="scrollbar-thin max-h-[640px] overflow-y-auto border border-outline-variant bg-surface-container-lowest px-md py-md">
            {briefs.map((brief) => (
              <BriefItem key={brief.slug} brief={brief} />
            ))}
          </div>

          {/* Sticky Newsletter Box — 스크롤을 내려도 고정 노출 */}
          <div className="sticky top-24 mt-md">
            <NewsletterForm
              title="뉴스레터 구독"
              description="매주 한 번, 기술과 브랜드의 흐름을 짚어주는 인사이트를 메일함으로 보내드립니다."
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
