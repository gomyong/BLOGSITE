/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // 런타임에 fs로 content/를 읽는 경로(브리프 페이지, 스튜디오 로컬 모드)를 위해
  // 서버리스 번들에 콘텐츠 파일을 포함시킨다.
  outputFileTracingIncludes: {
    "/briefs": ["./content/**/*"],
    "/api/admin/posts": ["./content/**/*"],
    "/api/admin/posts/[type]/[slug]": ["./content/**/*"],
    "/api/checkout": ["./content/**/*"],
  },
};

export default nextConfig;
