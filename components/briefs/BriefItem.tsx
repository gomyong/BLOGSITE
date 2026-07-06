import { ArrowUpRight } from "lucide-react";
import type { Brief } from "@/lib/mdx";
import { formatRelativeTime } from "@/lib/utils";

/** 텍스트 위주의 단신 피드 아이템 — 플랫 디바이더 구분 */
export default function BriefItem({ brief }: { brief: Brief }) {
  return (
    <article className="border-b border-outline-variant py-md first:pt-0 last:border-b-0">
      <div className="flex items-center gap-xs">
        <time
          dateTime={brief.date}
          className="font-label text-label-sm text-on-surface-variant"
        >
          {formatRelativeTime(brief.date)}
        </time>
        {brief.tags.map((tag) => (
          <span key={tag} className="chip">
            {tag}
          </span>
        ))}
      </div>
      <p className="mt-sm whitespace-pre-line text-body-md leading-relaxed text-on-surface">
        {brief.content.trim()}
      </p>
      {brief.link && (
        <a
          href={brief.link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-sm inline-flex items-center gap-1 font-label text-label-sm uppercase text-primary underline decoration-2 underline-offset-4 hover:text-primary-container"
        >
          원문 보기 <ArrowUpRight size={12} />
        </a>
      )}
    </article>
  );
}
