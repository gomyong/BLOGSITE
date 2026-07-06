import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import { formatDate } from "@/lib/utils";
import FadeIn from "@/components/motion/FadeIn";

export default function HomePage() {
  const posts = getAllPosts().slice(0, 4);

  return (
    <div className="mx-auto max-w-shell px-6 md:px-10">
      {/* Hero — 대담한 여백과 타이포그래피만으로 구성 */}
      <section className="py-24 md:py-40">
        <FadeIn>
          <p className="mb-8 text-xs font-medium uppercase tracking-[0.35em] text-neutral-400 dark:text-neutral-500">
            Text · Tech · Brand · Design
          </p>
          <h1 className="max-w-4xl text-4xl font-bold tracking-tight leading-[1.15] text-neutral-900 md:text-6xl dark:text-neutral-50">
            기술과 브랜드, 디자인의
            <br />
            교차점을 기록합니다.
          </h1>
          <p className="mt-10 max-w-xl text-lg leading-[1.8] text-neutral-500 dark:text-neutral-400">
            불필요한 장식을 걷어낸 텍스트 에세이. 여백과 타이포그래피의 비율만으로
            깊이 있는 통찰을 전달하는 개인 인사이클로피디아.
          </p>
        </FadeIn>
      </section>

      {/* Latest */}
      <section className="border-t border-neutral-100 py-16 md:py-24 dark:border-neutral-900">
        <div className="mb-16 flex items-baseline justify-between">
          <h2 className="text-xs font-medium uppercase tracking-[0.35em] text-neutral-400 dark:text-neutral-500">
            Latest Essays
          </h2>
          <Link
            href="/blog"
            className="text-sm text-neutral-500 underline underline-offset-4 decoration-neutral-300 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:decoration-neutral-600 dark:hover:text-neutral-50"
          >
            전체 보기
          </Link>
        </div>

        <div className="flex flex-col">
          {posts.map((post, i) => (
            <FadeIn key={post.slug} delay={i * 0.06}>
              <Link
                href={`/blog/${post.slug}`}
                className="group grid gap-3 border-b border-neutral-100 py-12 md:grid-cols-[160px_1fr] md:gap-12 dark:border-neutral-900"
              >
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500">
                  {post.category}
                </p>
                <div>
                  <h3 className="text-2xl font-bold tracking-tight leading-snug text-neutral-900 transition-colors group-hover:text-neutral-500 md:text-3xl dark:text-neutral-50 dark:group-hover:text-neutral-400">
                    {post.title}
                  </h3>
                  <p className="mt-4 max-w-2xl leading-[1.8] text-neutral-500 dark:text-neutral-400">
                    {post.summary}
                  </p>
                  <p className="mt-6 text-sm text-neutral-400 dark:text-neutral-500">
                    {formatDate(post.date)} · {post.readingTime}분 읽기
                  </p>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </section>
    </div>
  );
}
