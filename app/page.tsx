import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getBriefs, getFeaturedInsights, getInsights } from "@/lib/mdx";
import FeaturedArticle from "@/components/insight/FeaturedArticle";
import InsightCard from "@/components/insight/InsightCard";
import BriefItem from "@/components/briefs/BriefItem";
import NewsletterForm from "@/components/layout/NewsletterForm";

export default function HomePage() {
  const featured = getFeaturedInsights(3);
  const featuredSlugs = new Set(featured.map((i) => i.slug));
  const insights = getInsights().filter((i) => !featuredSlugs.has(i.slug));
  const briefs = getBriefs().slice(0, 8);

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 sm:py-12">
      {/* Hero / Featured — 디에디트 스타일 매거진 표지 */}
      {featured.length > 0 && (
        <section aria-label="Featured" className="space-y-6">
          <FeaturedArticle insight={featured[0]} />
          {featured.length > 1 && (
            <div className="grid gap-6 sm:grid-cols-2">
              {featured.slice(1).map((insight) => (
                <InsightCard key={insight.slug} insight={insight} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Dual Layout: Insights 그리드(60%) + Briefs 타임라인(40%) */}
      <div className="mt-16 grid gap-12 lg:grid-cols-5">
        <section aria-label="Insights" className="lg:col-span-3">
          <div className="flex items-baseline justify-between border-b border-ink-950 pb-3 dark:border-white">
            <h2 className="text-xl font-extrabold tracking-tightest text-ink-950 dark:text-white">
              Insights
            </h2>
            <span className="text-xs font-medium uppercase tracking-widest text-ink-400 dark:text-ink-500">
              심층 아티클
            </span>
          </div>
          <div className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2">
            {insights.map((insight) => (
              <InsightCard key={insight.slug} insight={insight} />
            ))}
          </div>
        </section>

        <aside aria-label="Briefs" className="lg:col-span-2">
          <div className="flex items-baseline justify-between border-b border-ink-950 pb-3 dark:border-white">
            <h2 className="text-xl font-extrabold tracking-tightest text-ink-950 dark:text-white">
              Briefs
            </h2>
            <Link
              href="/briefs"
              className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline dark:text-accent-dark"
            >
              전체 보기 <ArrowRight size={12} />
            </Link>
          </div>

          <div className="scrollbar-thin mt-4 max-h-[560px] overflow-y-auto pr-2">
            {briefs.map((brief) => (
              <BriefItem key={brief.slug} brief={brief} />
            ))}
          </div>

          {/* Sticky Newsletter Box — 스크롤을 내려도 우측에 고정 노출 */}
          <div className="sticky top-24 mt-8">
            <NewsletterForm />
          </div>
        </aside>
      </div>
    </div>
  );
}
