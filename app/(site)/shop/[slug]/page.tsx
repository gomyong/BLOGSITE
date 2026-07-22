import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, Truck } from "lucide-react";
import {
  getProductBySlug,
  getProducts,
  formatPrice,
} from "@/lib/products";
import { getInsightBySlug } from "@/lib/mdx";
import BuyButton from "@/components/shop/BuyButton";
import { siteConfig } from "@/lib/site";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.title,
    description: product.description,
    alternates: { canonical: `${siteConfig.url}/shop/${slug}` },
    openGraph: {
      title: product.title,
      description: product.description,
      images: product.image ? [{ url: product.image }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = product.relatedArticle
    ? getInsightBySlug(product.relatedArticle)
    : undefined;

  // Product JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.image ? [`${siteConfig.url}${product.image}`] : undefined,
    brand: { "@type": "Brand", name: product.vendor },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: product.currency,
      availability: product.soldOut
        ? "https://schema.org/OutOfStock"
        : "https://schema.org/InStock",
      url: `${siteConfig.url}/shop/${slug}`,
    },
  };

  return (
    <div className="mx-auto max-w-container-max px-[20px] py-lg md:px-lg">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Link
        href="/shop"
        className="inline-flex items-center gap-1 text-[13px] font-medium text-on-surface-variant hover:text-on-surface"
      >
        <ArrowLeft size={14} /> 편집샵
      </Link>

      <div className="mt-md grid gap-lg md:grid-cols-2">
        {/* 이미지 */}
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-surface-container-low">
          <Image
            src={product.image}
            alt={product.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 560px"
            className="object-cover"
          />
        </div>

        {/* 정보 */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="chip">{product.category}</span>
          </div>
          <h1 className="mt-3 font-headline text-[26px] font-extrabold leading-tight tracking-tight text-on-surface sm:text-[32px]">
            {product.title}
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-on-surface-variant">
            {product.description}
          </p>
          <p className="mt-lg font-headline text-[28px] font-extrabold text-on-surface">
            {formatPrice(product.price, product.currency)}
          </p>
          <p className="mt-1 flex items-center gap-1.5 text-[13px] text-on-surface-variant">
            <Truck size={14} /> 국내 · 해외 배송 (결제 시 배송지 입력)
          </p>

          <div className="mt-lg max-w-xs">
            <BuyButton slug={product.slug} soldOut={product.soldOut} />
          </div>

          {/* 본문 상세 */}
          {product.content.trim() && (
            <div className="mt-xl whitespace-pre-line border-t border-outline-variant pt-lg text-[14px] leading-relaxed text-on-surface-variant">
              {product.content.trim()}
            </div>
          )}

          {/* 연계 아티클 */}
          {related && (
            <Link
              href={`/insight/${related.slug}`}
              className="mt-lg flex items-center gap-3 rounded-xl border border-outline-variant p-3 transition-colors hover:border-on-surface"
            >
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-surface-container-low">
                <Image
                  src={related.coverImage}
                  alt={related.title}
                  fill
                  sizes="56px"
                  className="object-cover grayscale"
                />
              </div>
              <div>
                <p className="font-label text-[11px] uppercase tracking-wide text-on-surface-variant">
                  연결된 아티클
                </p>
                <p className="mt-0.5 line-clamp-1 text-[14px] font-semibold text-on-surface">
                  {related.title}
                </p>
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
