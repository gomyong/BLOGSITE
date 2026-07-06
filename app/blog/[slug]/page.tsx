import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { formatDate } from "@/lib/utils";
import { mdxComponents } from "@/components/mdx/MdxComponents";
import ProgressBar from "@/components/article/ProgressBar";
import FadeIn from "@/components/motion/FadeIn";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return { title: post.title, description: post.summary };
}

/**
 * PRD 3.2 — Article View.
 * Category (small, spaced) → H1 → Date · Reading Time 헤더 뒤에
 * max-w-[680px] 단일 컬럼 본문이 중앙 정렬로 이어진다.
 */
export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <article>
      <ProgressBar />

      <header className="mx-auto max-w-article px-6 pt-16 md:px-0 md:pt-24">
        <FadeIn>
          <Link
            href={`/blog?category=${encodeURIComponent(post.category)}`}
            className="text-xs font-medium uppercase tracking-[0.35em] text-neutral-400 transition-colors hover:text-neutral-900 dark:text-neutral-500 dark:hover:text-neutral-50"
          >
            {post.category}
          </Link>
          <h1 className="mt-8 text-4xl font-bold tracking-tight leading-[1.15] text-neutral-900 md:text-5xl dark:text-neutral-50">
            {post.title}
          </h1>
          <p className="mt-8 text-sm text-neutral-400 dark:text-neutral-500">
            {formatDate(post.date)} · {post.readingTime}분 읽기
          </p>
        </FadeIn>
      </header>

      <div className="article-body mx-auto max-w-article px-6 py-16 md:px-0 md:py-24">
        <MDXRemote source={post.content} components={mdxComponents} />
      </div>

      <footer className="mx-auto max-w-article border-t border-neutral-100 px-6 py-16 md:px-0 dark:border-neutral-900">
        <div className="flex flex-wrap gap-3">
          {post.tags.map((tag) => (
            <Link
              key={tag}
              href={`/blog?tags=${encodeURIComponent(tag)}`}
              className="rounded-full border border-neutral-200 px-4 py-1.5 text-sm text-neutral-600 transition-colors hover:border-neutral-900 hover:text-neutral-900 dark:border-neutral-800 dark:text-neutral-400 dark:hover:border-neutral-100 dark:hover:text-neutral-50"
            >
              #{tag}
            </Link>
          ))}
        </div>
        <Link
          href="/blog"
          className="mt-12 inline-block text-sm text-neutral-500 underline underline-offset-4 decoration-neutral-300 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:decoration-neutral-600 dark:hover:text-neutral-50"
        >
          ← 아카이브로 돌아가기
        </Link>
      </footer>
    </article>
  );
}
