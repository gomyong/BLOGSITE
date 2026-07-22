import { getInsights } from "@/lib/mdx";
import { getFeaturedProducts } from "@/lib/products";
import { siteConfig } from "@/lib/site";
import FeaturedHero from "@/components/insight/FeaturedHero";
import HomeFeed from "@/components/insight/HomeFeed";
import ShopBand from "@/components/shop/ShopBand";
import Reveal from "@/components/ui/Reveal";

export default function HomePage() {
  const all = getInsights().map(({ content: _c, ...meta }) => meta);
  const hero = all.find((i) => i.featured) ?? all[0];
  const rest = all.filter((i) => i.slug !== hero?.slug);
  const products = siteConfig.shopEnabled ? getFeaturedProducts(3) : [];

  return (
    <div className="mx-auto max-w-container-max space-y-xl px-[20px] py-lg md:px-lg">
      {/* 피처드 히어로 */}
      {hero && (
        <Reveal>
          <FeaturedHero insight={hero} />
        </Reveal>
      )}

      {/* Articles 목록 */}
      <section>
        <Reveal className="mb-lg flex items-end justify-between">
          <div>
            <h2 className="font-headline text-[24px] font-extrabold tracking-tight text-on-surface">
              Articles
            </h2>
            <p className="mt-1 text-[14px] text-on-surface-variant">
              기술과 브랜드, 그 사이의 이야기들
            </p>
          </div>
        </Reveal>
        <Reveal>
          <HomeFeed insights={rest} />
        </Reveal>
      </section>

      {/* Shop 밴드 (shopEnabled일 때만) */}
      {siteConfig.shopEnabled && products.length > 0 && (
        <Reveal>
          <ShopBand products={products} />
        </Reveal>
      )}
    </div>
  );
}
