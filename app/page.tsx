import { getFeaturedInsights, getInsights } from "@/lib/mdx";
import FeaturedArticle from "@/components/insight/FeaturedArticle";
import SecondaryFeatured from "@/components/insight/SecondaryFeatured";
import InsightCard from "@/components/insight/InsightCard";

export default function HomePage() {
  // 히어로에는 featured 2개만 사용, 나머지는 전부 그리드로
  const featured = getFeaturedInsights(2);
  const featuredSlugs = new Set(featured.map((i) => i.slug));
  const insights = getInsights().filter((i) => !featuredSlugs.has(i.slug));

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
          {featured[1] && (
            <div className="md:col-span-4">
              <SecondaryFeatured insight={featured[1]} />
            </div>
          )}
        </section>
      )}

      <hr className="mb-xl border-outline-variant" />

      {/* 게시글 그리드 — 메인 페이지는 오직 아티클로만 구성 */}
      <section aria-label="Insights">
        <div className="mb-lg flex items-end justify-between">
          <h2 className="font-headline text-headline-lg font-bold text-on-surface">
            최신 발간물
          </h2>
          <span className="font-label text-label-sm uppercase text-on-surface-variant">
            Insights
          </span>
        </div>
        <div className="grid grid-cols-1 gap-lg sm:grid-cols-2 lg:grid-cols-3">
          {insights.map((insight) => (
            <InsightCard key={insight.slug} insight={insight} />
          ))}
        </div>
      </section>
    </div>
  );
}
