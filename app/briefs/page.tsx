import Link from "next/link";
import type { Metadata } from "next";
import { getBriefs } from "@/lib/mdx";
import BriefItem from "@/components/briefs/BriefItem";
import NewsletterForm from "@/components/layout/NewsletterForm";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

const PER_PAGE = 10;

export const metadata: Metadata = {
  title: "Briefs — 단신 모아보기",
  description:
    "테크·브랜드·비즈니스 단신 뉴스를 빠르게 훑어보세요. 짧지만 놓치면 아쉬운 소식들.",
  alternates: { canonical: `${siteConfig.url}/briefs` },
};

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function BriefsPage({ searchParams }: PageProps) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);
  const briefs = getBriefs();
  const totalPages = Math.max(1, Math.ceil(briefs.length / PER_PAGE));
  const pageBriefs = briefs.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE
  );

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <div className="grid gap-12 lg:grid-cols-5">
        <section className="lg:col-span-3">
          <header className="border-b border-ink-950 pb-4 dark:border-white">
            <h1 className="text-3xl font-extrabold tracking-tightest text-ink-950 dark:text-white">
              Briefs
            </h1>
            <p className="mt-2 text-sm text-ink-500 dark:text-ink-400">
              짧고 빠른 테크 · 브랜드 단신. 놓치면 아쉬운 소식만 골라 담았습니다.
            </p>
          </header>

          <div className="mt-2">
            {pageBriefs.map((brief) => (
              <BriefItem key={brief.slug} brief={brief} />
            ))}
          </div>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <nav
              aria-label="페이지네이션"
              className="mt-10 flex items-center justify-center gap-2"
            >
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={p === 1 ? "/briefs" : `/briefs?page=${p}`}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold transition-colors",
                    p === currentPage
                      ? "bg-ink-950 text-white dark:bg-white dark:text-ink-950"
                      : "text-ink-500 hover:bg-ink-100 dark:text-ink-400 dark:hover:bg-ink-800"
                  )}
                >
                  {p}
                </Link>
              ))}
            </nav>
          )}
        </section>

        <aside className="lg:col-span-2">
          <div className="sticky top-24">
            <NewsletterForm />
          </div>
        </aside>
      </div>
    </div>
  );
}
