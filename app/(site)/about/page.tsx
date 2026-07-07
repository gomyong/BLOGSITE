import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `${siteConfig.name}을 소개합니다 — ${siteConfig.description}`,
  alternates: { canonical: `${siteConfig.url}/about` },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-content-max px-[20px] py-xl md:px-lg">
      <h1 className="font-headline text-2xl font-extrabold leading-tight tracking-tight text-on-surface sm:text-display">
        기술과 브랜드의 교차점을
        <br />
        정밀하게 읽습니다<span className="text-primary">.</span>
      </h1>

      <div className="mt-lg space-y-md text-body-lg leading-[1.8] text-on-surface-variant">
        <p>
          <strong className="font-bold text-on-surface">
            {siteConfig.name}
          </strong>
          는 기술, 테크, 브랜드, 기업 비즈니스 트렌드를 다루는 1인 미디어
          플랫폼입니다. 쏟아지는 뉴스 속에서 정말 중요한 맥락이 무엇인지, 그
          흐름이 어디로 향하는지를 읽어냅니다.
        </p>
        <p>
          깊이 있는 주관적 분석을 담은{" "}
          <strong className="font-bold text-on-surface">Insights</strong>와, 발
          빠르게 전하는 단신 뉴스{" "}
          <strong className="font-bold text-on-surface">Briefs</strong> — 두
          개의 타임라인으로 콘텐츠를 전합니다. 긴 호흡의 글이 필요할 때도, 빠른
          업데이트가 필요할 때도 이곳에서 해결할 수 있도록.
        </p>
        <p>
          군더더기 없는 화면, 계산된 여백, 90도 직각의 구조적 그리드. 광고와
          노이즈 없이 콘텐츠 그 자체에 집중하는 읽기 경험을 지향합니다.
        </p>
      </div>
    </div>
  );
}
