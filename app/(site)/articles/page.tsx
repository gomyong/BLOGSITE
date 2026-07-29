import type { Metadata } from "next";
import { getInsights } from "@/lib/mdx";
import { siteConfig } from "@/lib/site";
import HomeFeed from "@/components/insight/HomeFeed";
import Reveal from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Articles — 아티클 모아보기",
  description:
    "기술과 브랜드, 그 사이의 이야기들. 모든 아티클을 한눈에 확인하세요.",
  alternates: { canonical: `${siteConfig.url}/articles` },
};

export default function ArticlesPage() {
  const insights = getInsights().map(({ content: _c, ...meta }) => meta);

  return (
    <div className="mx-auto max-w-container-max space-y-xl px-[20px] py-lg md:px-lg">
      <Reveal className="flex items-end justify-between">
        <div>
          <h1 className="font-headline text-[24px] font-extrabold tracking-tight text-on-surface">
            Articles
          </h1>
          <p className="mt-1 text-[14px] text-on-surface-variant">
            기술과 브랜드, 그 사이의 이야기들
          </p>
        </div>
      </Reveal>
      <Reveal>
        <HomeFeed insights={insights} />
      </Reveal>
    </div>
  );
}
