import Image from "next/image";
import Link from "next/link";
import type { InsightMeta } from "@/lib/mdx";
import { formatDate } from "@/lib/utils";

/** 그리드 영역용 아티클 카드 — 플랫 보더 + 흑백→컬러 호버 썸네일 */
export default function InsightCard({ insight }: { insight: InsightMeta }) {
  return (
    <Link href={`/insight/${insight.slug}`} className="group flex h-full flex-col">
      <div className="relative mb-md aspect-video w-full overflow-hidden border border-outline-variant">
        <Image
          src={insight.coverImage}
          alt={insight.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover grayscale transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0"
        />
      </div>
      <div className="mb-sm flex items-center gap-xs">
        <span className="chip">{insight.category}</span>
        <span className="font-label text-label-sm text-on-surface-variant">
          {formatDate(insight.date)}
        </span>
      </div>
      <h3 className="mb-sm font-headline text-headline-md font-semibold text-on-surface transition-colors group-hover:text-primary">
        {insight.title}
      </h3>
      <p className="line-clamp-2 flex-grow text-body-md text-on-surface-variant">
        {insight.description}
      </p>
    </Link>
  );
}
