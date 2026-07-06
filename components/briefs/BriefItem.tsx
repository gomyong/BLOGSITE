import { ExternalLink } from "lucide-react";
import type { Brief } from "@/lib/mdx";
import { formatRelativeTime } from "@/lib/utils";

/** 트위터/스레드 피드 형태의 텍스트 위주 단신 아이템 */
export default function BriefItem({ brief }: { brief: Brief }) {
  return (
    <article className="border-b border-ink-100 py-5 first:pt-0 last:border-b-0 dark:border-ink-800">
      <div className="flex items-center gap-2 text-xs text-ink-400 dark:text-ink-500">
        <time dateTime={brief.date} className="font-medium">
          {formatRelativeTime(brief.date)}
        </time>
        {brief.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-ink-50 px-2 py-0.5 text-[11px] font-medium text-ink-500 dark:bg-ink-900 dark:text-ink-400"
          >
            {tag}
          </span>
        ))}
      </div>
      <p className="mt-2.5 whitespace-pre-line text-[15px] leading-relaxed text-ink-800 dark:text-ink-200">
        {brief.content.trim()}
      </p>
      {brief.link && (
        <a
          href={brief.link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2.5 inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline dark:text-accent-dark"
        >
          원문 보기 <ExternalLink size={12} />
        </a>
      )}
    </article>
  );
}
