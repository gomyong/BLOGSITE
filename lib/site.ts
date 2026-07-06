/** 사이트 전역 설정 — 배포 시 도메인과 이름을 실제 값으로 교체하세요. */
export const siteConfig = {
  name: "TECH+DESIGN",
  tagline: "Tech & Brand Insight Media",
  description:
    "기술, 테크, 브랜드, 기업 비즈니스 트렌드를 다루는 인사이트 미디어. 깊이 있는 심층 아티클과 발 빠른 단신 브리프를 함께 전합니다.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://blogsite.vercel.app",
  author: "운영자",
  locale: "ko_KR",
};
