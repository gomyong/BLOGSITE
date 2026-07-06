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
    <div className="mx-auto max-w-container-max px-[20px] py-lg md:px-lg">
      <div className="grid gap-lg lg:grid-cols-5">
        <section className="lg:col-span-3">
          <header className="border-b border-outline-variant pb-md">
            <h1 className="font-headline text-headline-lg font-bold text-on-surface">
              브리프
            </h1>
            <p className="mt-xs text-body-md text-on-surface-variant">
              짧고 빠른 테크 · 브랜드 단신. 놓치면 아쉬운 소식만 골라
              담았습니다.
            </p>
          </header>

          <div className="mt-xs">
            {pageBriefs.map((brief) => (
              <BriefItem key={brief.slug} brief={brief} />
            ))}
          </div>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <nav
              aria-label="페이지네이션"
              className="mt-lg flex items-center justify-center gap-xs"
            >
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={p === 1 ? "/briefs" : `/briefs?page=${p}`}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center border font-label text-label-sm transition-colors",
                    p === currentPage
                      ? "border-on-surface bg-on-surface text-surface"
                      : "border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary"
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
