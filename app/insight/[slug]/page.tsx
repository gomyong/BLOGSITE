import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { getAdjacentInsights, getInsightBySlug, getInsights } from "@/lib/mdx";
import { mdxComponents } from "@/components/mdx/MdxComponents";
import NewsletterForm from "@/components/layout/NewsletterForm";
import ReadingProgress from "@/components/insight/ReadingProgress";
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
      images: insight.coverImage ? [{ url: insight.coverImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: insight.title,
      description: insight.description,
      images: insight.coverImage ? [insight.coverImage] : undefined,
    },
  };
}

export default async function InsightPage({ params }: PageProps) {
  const { slug } = await params;
  const insight = getInsightBySlug(slug);
  if (!insight) notFound();

  const { prev, next } = getAdjacentInsights(slug);

  // 본문 30% 지점에 뉴스레터 폼 삽입 — 문단 단위로 분할
  const paragraphs = insight.content.split("\n\n");
  const splitIndex = Math.max(1, Math.floor(paragraphs.length * 0.3));
  const firstPart = paragraphs.slice(0, splitIndex).join("\n\n");
  const secondPart = paragraphs.slice(splitIndex).join("\n\n");

  // Article + NewsArticle JSON-LD (구글 리치 스니펫 대응)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["Article", "NewsArticle"],
    headline: insight.title,
    description: insight.description,
    datePublished: insight.date,
    author: { "@type": "Person", name: insight.author },
    publisher: { "@type": "Organization", name: siteConfig.name },
    image: insight.coverImage
      ? [`${siteConfig.url}${insight.coverImage}`]
      : undefined,
    mainEntityOfPage: `${siteConfig.url}/insight/${slug}`,
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
        {/* 화면 꽉 차는 고화질 커버 이미지 */}
        {insight.coverImage && (
          <div className="relative h-[45vh] w-full sm:h-[60vh]">
            <Image
              src={insight.coverImage}
              alt={insight.title}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
        )}

        {/* 본문 — 읽기 최적화를 위해 최대 너비 700px 제한 */}
        <div className="mx-auto max-w-[700px] px-5">
          <header className="-mt-16 relative rounded-t-3xl bg-white px-2 pt-10 sm:px-8 dark:bg-ink-950">
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-widest text-accent dark:text-accent-dark">
              <span>{insight.category}</span>
              <span className="flex items-center gap-1 font-medium normal-case tracking-normal text-ink-400 dark:text-ink-500">
                <Clock size={12} /> {insight.readingTime}분 읽기
              </span>
            </div>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tightest text-ink-950 sm:text-4xl dark:text-white">
              {insight.title}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-ink-500 dark:text-ink-400">
              {insight.description}
            </p>
            <div className="mt-6 flex items-center gap-3 border-b border-ink-100 pb-8 text-sm text-ink-500 dark:border-ink-800 dark:text-ink-400">
              <span className="font-semibold text-ink-900 dark:text-ink-100">
                {insight.author}
              </span>
              <span className="text-ink-300 dark:text-ink-600">·</span>
              <time dateTime={insight.date}>{formatDate(insight.date)}</time>
            </div>
          </header>

          <div className="prose prose-ink px-2 py-10 dark:prose-invert sm:px-8">
            <MDXRemote source={firstPart} components={mdxComponents} />
            <NewsletterForm
              variant="compact"
              title="여기까지 재미있게 읽으셨나요?"
              description="이런 인사이트를 매주 메일함에서 받아보세요. 스팸 없이, 핵심만 보내드립니다."
            />
            <MDXRemote source={secondPart} components={mdxComponents} />
          </div>

          <div className="px-2 sm:px-8">
            {insight.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {insight.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-ink-50 px-3 py-1 text-xs font-medium text-ink-500 dark:bg-ink-900 dark:text-ink-400"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-10">
              <NewsletterForm />
            </div>

            {/* 이전 글 / 다음 글 */}
            <nav className="mt-10 grid gap-4 border-t border-ink-100 py-10 sm:grid-cols-2 dark:border-ink-800">
              {prev ? (
                <Link
                  href={`/insight/${prev.slug}`}
                  className="group rounded-xl border border-ink-100 p-5 transition-colors hover:border-ink-300 dark:border-ink-800 dark:hover:border-ink-600"
                >
                  <span className="flex items-center gap-1 text-xs font-medium text-ink-400 dark:text-ink-500">
                    <ArrowLeft size={12} /> 이전 글
                  </span>
                  <p className="mt-2 line-clamp-2 text-sm font-bold text-ink-900 group-hover:text-accent dark:text-ink-100 dark:group-hover:text-accent-dark">
                    {prev.title}
                  </p>
                </Link>
              ) : (
                <div />
              )}
              {next && (
                <Link
                  href={`/insight/${next.slug}`}
                  className="group rounded-xl border border-ink-100 p-5 text-right transition-colors hover:border-ink-300 dark:border-ink-800 dark:hover:border-ink-600"
                >
                  <span className="flex items-center justify-end gap-1 text-xs font-medium text-ink-400 dark:text-ink-500">
                    다음 글 <ArrowRight size={12} />
                  </span>
                  <p className="mt-2 line-clamp-2 text-sm font-bold text-ink-900 group-hover:text-accent dark:text-ink-100 dark:group-hover:text-accent-dark">
                    {next.title}
                  </p>
                </Link>
              )}
            </nav>
          </div>
        </div>
      </article>
    </>
  );
}
