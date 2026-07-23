import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { getAdjacentInsights, getInsightBySlug, getInsights } from "@/lib/mdx";
import { getProductsForArticle } from "@/lib/products";
import MarkdownContent from "@/components/mdx/MarkdownContent";
import ReadingProgress from "@/components/insight/ReadingProgress";
import CopyAttribution from "@/components/insight/CopyAttribution";
import ProductCard from "@/components/shop/ProductCard";
import { formatDate } from "@/lib/utils";
import { siteConfig } from "@/lib/site";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getInsights().map((insight) => ({ slug: insight.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const insight = getInsightBySlug(slug);
  if (!insight) return {};

  const url = `${siteConfig.url}/insight/${slug}`;
  // og:image / twitter:image 는 opengraph-image.tsx 가 자동 생성한다.
  return {
    title: insight.title,
    description: insight.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: insight.title,
      description: insight.description,
      publishedTime: insight.date,
      authors: [insight.author],
      tags: insight.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: insight.title,
      description: insight.description,
    },
  };
}

export default async function InsightPage({ params }: PageProps) {
  const { slug } = await params;
  const insight = getInsightBySlug(slug);
  if (!insight) notFound();

  const { prev, next } = getAdjacentInsights(slug);
  const relatedProducts = siteConfig.shopEnabled
    ? getProductsForArticle(slug)
    : [];

  // Article + NewsArticle JSON-LD (구글 리치 스니펫 대응)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["Article", "NewsArticle"],
    headline: insight.title,
    description: insight.description,
    datePublished: insight.date,
    dateModified: insight.updated,
    author: {
      "@type": "Person",
      name: insight.author,
      url: `${siteConfig.url}/about`,
    },
    publisher: {
      "@type": "Organization",
      "@id": `${siteConfig.url}/#organization`,
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}${siteConfig.logo}`,
      },
    },
    // 소셜 미리보기와 동일한 자동 생성 OG 이미지를 대표 이미지로 사용
    image: [`${siteConfig.url}/insight/${slug}/opengraph-image`],
    mainEntityOfPage: `${siteConfig.url}/insight/${slug}`,
    inLanguage: "ko-KR",
    keywords: insight.tags.join(", "),
  };

  return (
    <>
      <ReadingProgress />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article>
        {/* Reading Rail — 본문 최대 너비 720px 제한. 커버 이미지도 이 폭에 맞춘다 */}
        <div className="mx-auto max-w-content-max px-[20px] pt-lg md:px-lg">
          {insight.coverImage && (
            <div className="relative mb-lg aspect-video w-full overflow-hidden border border-outline-variant">
              <Image
                src={insight.coverImage}
                alt={insight.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 720px"
                className="object-cover"
              />
            </div>
          )}
          <header className="border-b border-outline-variant pb-lg">
            <div className="flex flex-wrap items-center gap-xs">
              <span className="chip">{insight.category}</span>
              <span className="flex items-center gap-1 font-label text-label-sm text-on-surface-variant">
                <Clock size={12} /> {insight.readingTime}분 읽기
              </span>
            </div>
            <h1 className="mt-md font-headline text-2xl font-extrabold leading-tight tracking-tight text-on-surface sm:text-display">
              {insight.title}
            </h1>
            <p className="mt-md text-body-lg text-on-surface-variant">
              {insight.description}
            </p>
            <div className="mt-md flex items-center gap-sm font-label text-label-sm text-on-surface-variant">
              <span className="font-medium text-on-surface">
                {insight.author}
              </span>
              <span className="text-outline-variant">|</span>
              <time dateTime={insight.date}>{formatDate(insight.date)}</time>
            </div>
          </header>

          <CopyAttribution
            title={insight.title}
            url={`${siteConfig.url}/insight/${slug}`}
          >
            <div className="prose py-lg">
              <MarkdownContent source={insight.content} />
            </div>
          </CopyAttribution>

          {insight.tags.length > 0 && (
            <div className="flex flex-wrap gap-xs">
              {insight.tags.map((tag) => (
                <span key={tag} className="chip">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* 연계 상품 (편집샵) */}
          {relatedProducts.length > 0 && (
            <div className="mt-xl border-t border-outline-variant pt-lg">
              <h2 className="font-headline text-[18px] font-extrabold tracking-tight text-on-surface">
                이 글과 연결된 물건
              </h2>
              <div className="mt-md grid grid-cols-2 gap-3">
                {relatedProducts.map((p) => (
                  <ProductCard key={p.slug} product={p} />
                ))}
              </div>
            </div>
          )}

          {/* 이전 글 / 다음 글 */}
          <nav className="grid gap-md border-t border-outline-variant py-lg sm:grid-cols-2 mt-lg">
            {prev ? (
              <Link
                href={`/insight/${prev.slug}`}
                className="group border border-outline-variant bg-surface-container-lowest p-md transition-colors hover:border-outline"
              >
                <span className="flex items-center gap-1 font-label text-label-sm uppercase text-on-surface-variant">
                  <ArrowLeft size={12} /> 이전 글
                </span>
                <p className="mt-xs line-clamp-2 font-headline text-sm font-semibold text-on-surface group-hover:text-primary">
                  {prev.title}
                </p>
              </Link>
            ) : (
              <div />
            )}
            {next && (
              <Link
                href={`/insight/${next.slug}`}
                className="group border border-outline-variant bg-surface-container-lowest p-md text-right transition-colors hover:border-outline"
              >
                <span className="flex items-center justify-end gap-1 font-label text-label-sm uppercase text-on-surface-variant">
                  다음 글 <ArrowRight size={12} />
                </span>
                <p className="mt-xs line-clamp-2 font-headline text-sm font-semibold text-on-surface group-hover:text-primary">
                  {next.title}
                </p>
              </Link>
            )}
          </nav>
        </div>
      </article>
    </>
  );
}
