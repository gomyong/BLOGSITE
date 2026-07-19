/**
 * OG 이미지(ImageResponse)용 Pretendard 폰트 로더.
 * 한글 렌더링을 위해 정적 웨이트를 CDN에서 가져온다. 실패 시 null을 반환해
 * 기본 폰트로 폴백(빌드는 깨지지 않음 — 로컬/오프라인 빌드 안전).
 */
const FONT_URL =
  "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/public/static/Pretendard-Bold.otf";

let cache: ArrayBuffer | null | undefined;

export async function loadPretendardBold(): Promise<ArrayBuffer | null> {
  if (cache !== undefined) return cache;
  try {
    const res = await fetch(FONT_URL, { cache: "force-cache" });
    if (!res.ok) throw new Error(`font ${res.status}`);
    cache = await res.arrayBuffer();
  } catch {
    cache = null;
  }
  return cache;
}
