import { getInsights } from "@/lib/mdx";
import HomeFeed from "@/components/insight/HomeFeed";

export default function HomePage() {
  // 클라이언트 필터 컴포넌트에는 본문을 제외한 메타데이터만 전달
  const insights = getInsights().map(({ content: _content, ...meta }) => meta);

  return (
    <div className="mx-auto max-w-container-max px-[20px] md:px-lg">
      {/* X-style 인트로 — 초대형 디스플레이 타이틀 + 넉넉한 여백 */}
      <section className="py-xl md:py-section">
        <p className="font-label text-label-sm uppercase tracking-widest text-on-surface-variant">
          Blog
        </p>
        <h1 className="mt-sm max-w-3xl font-headline text-3xl font-extrabold leading-[1.12] tracking-tight text-on-surface sm:text-[44px]">
          기술과 브랜드의
          <br />
          다음 챕터를 기록합니다<span className="text-accent">.</span>
        </h1>
        <p className="mt-md max-w-xl text-body-lg text-on-surface-variant">
          깊이 있는 심층 아티클과 발 빠른 단신 브리프 — 두 개의 타임라인으로
          기술 · 브랜드 · 비즈니스의 흐름을 읽습니다.
        </p>
      </section>

      <HomeFeed insights={insights} />

      <div className="py-xl" />
    </div>
  );
}
