import { getInsights } from "@/lib/mdx";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-static";

/**
 * llms.txt — AI 답변엔진/크롤러에 사이트 구조와 콘텐츠를 안내하는 관례 파일.
 * https://llmstxt.org 형식.
 */
export function GET() {
  const insights = getInsights();
  const recent = insights
    .slice(0, 20)
    .map(
      (i) =>
        `- [${i.title}](${siteConfig.url}/insight/${i.slug}): ${i.description}`
    )
    .join("\n");

  const body = `# ${siteConfig.name}

> ${siteConfig.description}

${siteConfig.name}은 기술 · 브랜드 · 비즈니스 트렌드를 다루는 인사이트 미디어입니다.
콘텐츠는 두 종류입니다: 깊이 있는 분석 글(Insights)과 짧은 단신(Briefs).

## 주요 페이지

- [홈 / 아티클 목록](${siteConfig.url}/): 최신 심층 아티클
- [Briefs](${siteConfig.url}/briefs): 짧은 단신 뉴스 모음
- [About](${siteConfig.url}/about): 소개
- [RSS 피드](${siteConfig.url}/feed.xml)

## 최근 아티클

${recent}

## 인용 안내

각 아티클은 Article/NewsArticle 구조화 데이터(JSON-LD)를 포함합니다.
인용 시 원문 링크(${siteConfig.url}/insight/<slug>)와 매체명 "${siteConfig.name}"을 함께 표기해 주세요.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
