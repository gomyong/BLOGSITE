import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProducts } from "@/lib/products";
import ProductCard from "@/components/shop/ProductCard";
import Reveal from "@/components/ui/Reveal";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "TEAL+DOT이 직접 고르고 만든 물건들. 아티클과 연결된 인쇄물과 굿즈.",
  alternates: { canonical: `${siteConfig.url}/shop` },
};

export default function ShopPage() {
  if (!siteConfig.shopEnabled) notFound();
  const products = getProducts();
  return (
    <div className="mx-auto max-w-container-max px-[20px] py-lg md:px-lg">
      <Reveal className="max-w-2xl">
        <h1 className="font-headline text-[32px] font-extrabold leading-tight tracking-tight text-on-surface sm:text-[40px]">
          Shop<span className="text-accent">.</span>
        </h1>
        <p className="mt-3 text-[16px] leading-relaxed text-on-surface-variant">
          우리가 직접 고르고 만든 물건들. 아티클과 연결된 인쇄물과 굿즈를
          소개합니다.
        </p>
      </Reveal>

      <Reveal className="mt-xl grid grid-cols-2 gap-3 sm:gap-lg lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </Reveal>

      {products.length === 0 && (
        <p className="py-xl text-center text-body-md text-on-surface-variant">
          아직 등록된 상품이 없습니다.
        </p>
      )}
    </div>
  );
}
