import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/lib/products";
import ProductCard from "./ProductCard";

/** CLIP "Featured Company Partners" 스타일 다크 컨테이너 — 편집샵 추천 상품 */
export default function ShopBand({ products }: { products: Product[] }) {
  if (!products.length) return null;
  return (
    <section className="rounded-3xl bg-inverse-surface p-5 sm:p-lg">
      <div className="mb-lg flex items-end justify-between px-1">
        <div>
          <h2 className="font-headline text-[22px] font-extrabold tracking-tight text-inverse-on-surface">
            Shop
          </h2>
          <p className="mt-1 text-[13px] text-inverse-on-surface/60">
            아티클과 연결된, 우리가 직접 고른 물건들
          </p>
        </div>
        <Link
          href="/shop"
          className="inline-flex items-center gap-1 rounded-full border border-white/20 px-3.5 py-1.5 text-[13px] font-medium text-inverse-on-surface transition-colors hover:bg-white/10"
        >
          전체 보기 <ArrowRight size={14} />
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {products.map((p) => (
          <ProductCard key={p.slug} product={p} dark />
        ))}
      </div>
    </section>
  );
}
