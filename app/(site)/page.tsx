import { getInsights, getBriefs } from "@/lib/mdx";
import { getFeaturedProducts } from "@/lib/products";
import { siteConfig } from "@/lib/site";
import FeaturedHero from "@/components/insight/FeaturedHero";
import HomePreview from "@/components/insight/HomePreview";
import ShopBand from "@/components/shop/ShopBand";
import Reveal from "@/components/ui/Reveal";

// 홈 미리보기 그리드는 3칸(아티클 2 + Brief 캐러셀 1)만 보여주고, 전체 목록은
// /articles로 안내한다. Brief 캐러셀은 최신 5건까지 옆으로 넘겨볼 수 있다.
const PREVIEW_ARTICLE_COUNT = 2;
const PREVIEW_BRIEF_COUNT = 5;

export default function HomePage() {
  const all = getInsights().map(({ content: _c, ...meta }) => meta);
  const hero = all.find((i) => i.featured) ?? all[0];
  const rest = all.filter((i) => i.slug !== hero?.slug);
  const products = siteConfig.shopEnabled ? getFeaturedProducts(3) : [];
  const briefs = getBriefs().slice(0, PREVIEW_BRIEF_COUNT);

  return (
    <div className="mx-auto max-w-container-max space-y-xl px-[20px] py-lg md:px-lg">
      {/* 피처드 히어로 */}
      {hero && (
        <Reveal>
          <FeaturedHero insight={hero} />
        </Reveal>
      )}

      {/* Articles 미리보기 (아티클 2 + Brief 캐러셀 1) */}
      <Reveal>
        <HomePreview
          insights={rest.slice(0, PREVIEW_ARTICLE_COUNT)}
          briefs={briefs}
        />
      </Reveal>

      {/* Shop 밴드 (shopEnabled일 때만) */}
      {siteConfig.shopEnabled && products.length > 0 && (
        <Reveal>
          <ShopBand products={products} />
        </Reveal>
      )}
    </div>
  );
}
