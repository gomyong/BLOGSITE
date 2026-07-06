import type { Metadata } from "next";
import NewsletterForm from "@/components/layout/NewsletterForm";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `${siteConfig.name}을 소개합니다 — ${siteConfig.description}`,
  alternates: { canonical: `${siteConfig.url}/about` },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[700px] px-5 py-16">
      <h1 className="text-3xl font-extrabold tracking-tightest text-ink-950 sm:text-4xl dark:text-white">
        기술과 브랜드의 흐름에
        <br />
        밑줄을 긋습니다<span className="text-accent dark:text-accent-dark">.</span>
      </h1>

      <div className="mt-10 space-y-6 text-base leading-[1.85] text-ink-700 dark:text-ink-300">
        <p>
          <strong className="font-bold text-ink-950 dark:text-white">
            {siteConfig.name}
          </strong>
          는 기술, 테크, 브랜드, 기업 비즈니스 트렌드를 다루는 1인 미디어
          플랫폼입니다. 쏟아지는 뉴스 속에서 정말 중요한 맥락이 무엇인지,
          그 흐름이 어디로 향하는지를 읽어냅니다.
        </p>
        <p>
          깊이 있는 주관적 분석을 담은{" "}
          <strong className="font-bold text-ink-950 dark:text-white">
            Insights
          </strong>
          와, 발 빠르게 전하는 단신 뉴스{" "}
          <strong className="font-bold text-ink-950 dark:text-white">
            Briefs
          </strong>
          — 두 개의 타임라인으로 콘텐츠를 전합니다. 긴 호흡의 글이 필요할 때도,
          빠른 업데이트가 필요할 때도 이곳에서 해결할 수 있도록.
        </p>
        <p>
          군더더기 없는 화면, 계산된 여백, 읽기에 집중한 타이포그래피.
          광고와 노이즈 없이 콘텐츠 그 자체에 집중하는 읽기 경험을 지향합니다.
        </p>
      </div>

      <div className="mt-14">
        <NewsletterForm
          title="함께 읽어요"
          description="매주 한 번, 그 주의 가장 중요한 인사이트를 요약해 메일함으로 보내드립니다."
        />
      </div>
    </div>
  );
}
