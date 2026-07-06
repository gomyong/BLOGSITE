import type { Metadata } from "next";
import FadeIn from "@/components/motion/FadeIn";

export const metadata: Metadata = {
  title: "About",
  description: "센서리얼 텍스트 & 테크 미니멀 블로그 소개.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-article px-6 py-24 md:px-0 md:py-40">
      <FadeIn>
        <p className="mb-8 text-xs font-medium uppercase tracking-[0.35em] text-neutral-400 dark:text-neutral-500">
          About
        </p>
        <h1 className="text-4xl font-bold tracking-tight leading-[1.15] text-neutral-900 md:text-5xl dark:text-neutral-50">
          Sensory Minimalism.
        </h1>
        <div className="article-body mt-16">
          <p>
            이 블로그는 기술, 디자인, 브랜드의 교차점을 다루는 텍스트 에세이
            플랫폼입니다. 불필요한 장식적 요소를 배제하고, 타이포그래피의 비율과
            여백만으로 시각적 완성도를 만듭니다.
          </p>
          <blockquote>
            <p>단순함은 궁극의 정교함이다.</p>
          </blockquote>
          <p>
            글은 지식의 나열이 아니라 맥락의 연결이라고 믿습니다. 하나의 주제를
            깊게 파고들되, 그것이 다른 영역과 만나는 지점에서 생기는 통찰을
            기록합니다.
          </p>
        </div>
      </FadeIn>
    </div>
  );
}
