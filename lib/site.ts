/** 사이트 전역 설정 — 배포 시 도메인과 이름을 실제 값으로 교체하세요. */
const DEFAULT_SITE_URL = "https://tealdot.dev";

// 끝에 슬래시("/")나 공백/줄바꿈이 실수로 붙어도 canonical/sitemap이 깨지지 않도록 정리한다.
const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "");
// 환경변수에 URL이 아닌 값(예: 메타태그 문자열)이 잘못 들어가도 사이트가 깨지지 않도록,
// http(s)로 시작하는 올바른 URL일 때만 사용하고 아니면 기본 도메인으로 복구한다.
const siteUrl =
  rawSiteUrl && /^https?:\/\//.test(rawSiteUrl) ? rawSiteUrl : DEFAULT_SITE_URL;

export const siteConfig = {
  name: "TEAL+DOT",
  tagline: "Tech & Brand Insight Media",
  description:
    "기술, 테크, 브랜드, 기업 비즈니스 트렌드를 다루는 인사이트 미디어. 깊이 있는 심층 아티클과 발 빠른 단신 브리프를 함께 전합니다.",
  url: siteUrl,
  author: "운영자",
  locale: "ko_KR",
  /**
   * 검색엔진 소유권 확인 코드. 페이지 소스에 노출되는 공개 값이라 코드에 직접 둔다.
   * 환경변수(NEXT_PUBLIC_GOOGLE/NAVER_VERIFICATION)가 있으면 그 값이 우선한다.
   */
  googleVerification:
    process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION ||
    "3r4KXjoqb3WCF2nSANwmHQpkgeb2FlObwE02o3IFHTc",
  naverVerification:
    process.env.NEXT_PUBLIC_NAVER_VERIFICATION ||
    "590e31ed39d53598914bb686a0c88f59e6bb64b2",
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
