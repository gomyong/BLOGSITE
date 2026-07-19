import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";
import { loadPretendardBold } from "@/lib/loadOgFont";

export const runtime = "nodejs";
export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** 사이트 기본 OG 이미지 (홈·About 등 글이 아닌 페이지 공유 시) */
export default async function Image() {
  const font = await loadPretendardBold();
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
        <div style={{ display: "flex", fontSize: 30, letterSpacing: 4 }}>
          <div style={{ opacity: 0.6 }}>{siteConfig.name}</div>
          <div style={{ color: "#2dd4bf" }}>.</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 72, fontWeight: 700 }}>
            기술과 브랜드의
          </div>
          <div style={{ display: "flex", fontSize: 72, fontWeight: 700 }}>
            <div>다음 챕터를 기록합니다</div>
            <div style={{ color: "#2dd4bf" }}>.</div>
          </div>
          <div style={{ display: "flex", marginTop: 28, fontSize: 30, opacity: 0.65 }}>
            {siteConfig.tagline}
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: font ? [{ name: "Pretendard", data: font, weight: 700 }] : undefined }
  );
}
