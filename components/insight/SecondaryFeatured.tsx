import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { InsightMeta } from "@/lib/mdx";
import { formatDate } from "@/lib/utils";

/** 벤토 히어로의 보조 셀 — 이미지 없이 텍스트로 강조하는 Featured 카드 */
export default function SecondaryFeatured({
  insight,
}: {
  insight: InsightMeta;
}) {
  return (
    <Link
      href={`/insight/${insight.slug}`}
      className="group flex flex-1 flex-col justify-between border border-outline-variant bg-surface-container-lowest p-md transition-colors hover:border-outline"
    >
      <div>
        <div className="mb-md flex items-center gap-xs">
          <span className="chip">{insight.category}</span>
          <span className="font-label text-label-sm text-on-surface-variant">
            {formatDate(insight.date)}
          </span>
        </div>
        <h2 className="mb-sm font-headline text-headline-md font-semibold text-on-surface transition-colors group-hover:text-primary">
          {insight.title}
        </h2>
        <p className="line-clamp-3 text-body-md text-on-surface-variant">
          {insight.description}
        </p>
      </div>
      <span className="mt-md flex items-center gap-xs font-label text-label-sm uppercase text-primary">
        기사 읽기 <ArrowUpRight size={14} />
      </span>
    </Link>
  );
}
