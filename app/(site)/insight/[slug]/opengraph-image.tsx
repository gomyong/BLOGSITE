import { ImageResponse } from "next/og";
import { getInsightBySlug, getInsights } from "@/lib/mdx";
import { siteConfig } from "@/lib/site";
import { loadPretendardBold } from "@/lib/loadOgFont";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getInsights().map((i) => ({ slug: i.slug }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

/** 아티클별 OG 이미지 — 제목이 박힌 PNG를 자동 생성 (SVG 커버 문제 해결) */
export default async function Image({ params }: Props) {
  const { slug } = await params;
  const insight = getInsightBySlug(slug);
  const font = await loadPretendardBold();
  const title = insight?.title ?? siteConfig.name;
  const category = insight?.category ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0d0d0d",
          color: "#ffffff",
          padding: "72px",
          fontFamily: font ? "Pretendard" : "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 26,
            letterSpacing: 3,
          }}
        >
          {category ? (
            <div
              style={{
                display: "flex",
                border: "1px solid rgba(255,255,255,0.4)",
                padding: "6px 16px",
                textTransform: "uppercase",
              }}
            >
              {category}
            </div>
          ) : null}
          <div style={{ display: "flex", opacity: 0.55 }}>{siteConfig.name}</div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: title.length > 34 ? 56 : 68,
            lineHeight: 1.25,
            fontWeight: 700,
            maxWidth: "1000px",
          }}
        >
          {title}
        </div>

        <div style={{ display: "flex", alignItems: "center", fontSize: 26 }}>
          <div style={{ opacity: 0.55 }}>{siteConfig.tagline}</div>
          <div
            style={{ width: 14, height: 14, background: "#2dd4bf", marginLeft: 14 }}
          />
        </div>
      </div>
    ),
    { ...size, fonts: font ? [{ name: "Pretendard", data: font, weight: 700 }] : undefined }
  );
}
