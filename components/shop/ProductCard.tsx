import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/products";

/** CLIP "Company Partners" 스타일 상품 카드 — 이미지 + 구조화 정보 행 */
export default function ProductCard({
  product,
  dark = false,
}: {
  product: Product;
  dark?: boolean;
}) {
  return (
    <Link
      href={`/shop/${product.slug}`}
      className={
        dark
          ? "group flex flex-col overflow-hidden rounded-xl bg-surface p-2.5 transition-transform hover:-translate-y-0.5"
          : "group flex flex-col overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest p-2.5 transition-transform hover:-translate-y-0.5"
      }
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-surface-container-low">
        <Image
          src={product.image}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        {product.soldOut && (
          <span className="absolute left-2 top-2 rounded-full bg-black/80 px-2.5 py-1 font-label text-[11px] text-white">
            SOLD OUT
          </span>
        )}
      </div>

      <div className="px-1.5 pb-1 pt-3">
        <div className="flex items-center gap-1.5">
          <span className="chip">{product.category}</span>
        </div>
        <h3 className="mt-2 font-headline text-[15px] font-bold leading-snug tracking-tight text-on-surface group-hover:text-accent">
          {product.title}
        </h3>

        {/* 구조화 정보 행 (CLIP 파트너 카드 스타일) */}
        <dl className="mt-3 space-y-1.5 border-t border-outline-variant pt-3 text-[12px]">
          <div className="flex items-center justify-between">
            <dt className="text-on-surface-variant">판매처</dt>
            <dd className="font-medium text-on-surface">{product.vendor}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-on-surface-variant">가격</dt>
            <dd className="font-bold text-on-surface">
              {formatPrice(product.price, product.currency)}
            </dd>
          </div>
        </dl>
      </div>
    </Link>
  );
}
