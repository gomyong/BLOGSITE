/** 사이트 전역 설정 — 배포 시 도메인과 이름을 실제 값으로 교체하세요. */
// 끝에 슬래시("/")나 공백/줄바꿈이 실수로 붙어도 canonical/sitemap이 깨지지 않도록 정리한다.
const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "");

export const siteConfig = {
  name: "TEAL+DOT",
  tagline: "Tech & Brand Insight Media",
  description:
    "기술, 테크, 브랜드, 기업 비즈니스 트렌드를 다루는 인사이트 미디어. 깊이 있는 심층 아티클과 발 빠른 단신 브리프를 함께 전합니다.",
  url: rawSiteUrl || "https://tealdot.dev",
  author: "운영자",
  locale: "ko_KR",
  /** AEO/구조화 데이터용 조직 로고 (기본은 자동 생성 OG 이미지) */
  logo: "/opengraph-image",
  /** 소유 SNS·프로필 URL — 채우면 Organization schema의 sameAs로 연결됨 */
  sameAs: [] as string[],
  /**
   * Shop(판매) 기능 온/오프. 기본 off — 상품이 준비되면 Vercel 환경변수
   * NEXT_PUBLIC_SHOP_ENABLED=true 로 켠다. 끄면 Shop 관련 페이지·링크가 모두 숨겨진다.
   */
  shopEnabled: process.env.NEXT_PUBLIC_SHOP_ENABLED === "true",
};
