import Image from "next/image";
import Link from "next/link";
import type { InsightMeta } from "@/lib/mdx";
import { formatDate } from "@/lib/utils";

/** 그리드 영역용 아티클 카드 — 썸네일 + 카테고리 + 제목 + 요약 */
export default function InsightCard({ insight }: { insight: InsightMeta }) {
  return (
    <Link href={`/insight/${insight.slug}`} className="group block">
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl">
        <Image
          src={insight.coverImage}
          alt={insight.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="mt-4">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-accent dark:text-accent-dark">
          <span>{insight.category}</span>
          <span className="text-ink-300 dark:text-ink-600">·</span>
          <span className="font-medium normal-case tracking-normal text-ink-400 dark:text-ink-500">
            {formatDate(insight.date)}
          </span>
        </div>
        <h3 className="mt-2 text-lg font-bold leading-snug tracking-tight text-ink-950 transition-colors group-hover:text-accent dark:text-white dark:group-hover:text-accent-dark">
          {insight.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-500 dark:text-ink-400">
          {insight.description}
        </p>
      </div>
    </Link>
  );
}
