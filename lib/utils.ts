import { format, formatDistanceToNowStrict, parseISO } from "date-fns";
import { ko } from "date-fns/locale";

/** Tailwind 클래스 조건부 결합 유틸 */
export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

/** "2026년 7월 6일" 형태의 날짜 포맷 */
export function formatDate(dateString: string) {
  return format(parseISO(dateString), "yyyy년 M월 d일", { locale: ko });
}

/** "2시간 전" 형태의 상대 시간 포맷 (Briefs 피드용) */
export function formatRelativeTime(dateString: string) {
  return formatDistanceToNowStrict(parseISO(dateString), {
    addSuffix: true,
    locale: ko,
  });
}

/** 본문 텍스트에서 메타 디스크립션용 첫 N자 추출 (마크다운 문법 제거) */
export function extractExcerpt(markdown: string, length = 100) {
  const plain = markdown
    .replace(/```[\s\S]*?```/g, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_`~-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return plain.length > length ? `${plain.slice(0, length)}…` : plain;
}
