import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { InsightMeta } from "@/lib/mdx";
import { formatDate } from "@/lib/utils";

/** 벤토 히어로의 메인 셀 — 흑백 커버가 호버 시 컬러로 전환되는 Featured 아티클 */
export default function FeaturedArticle({ insight }: { insight: InsightMeta }) {
  return (
    <Link
      href={`/insight/${insight.slug}`}
      className="group relative block min-h-[400px] overflow-hidden border border-outline-variant bg-surface-container-lowest"
    >
      <Image
        src={insight.coverImage}
        alt={insight.title}
        fill
        priority
        sizes="(max-width: 768px) 100vw, 740px"
        className="object-cover grayscale transition-all duration-700 group-hover:grayscale-0"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1a1c1e]/90 via-[#1a1c1e]/40 to-transparent" />

      <div className="absolute bottom-0 left-0 w-full p-md sm:p-lg">
        <div className="mb-sm flex items-center gap-xs">
          <span className="chip border border-white/25 bg-white/15 text-white backdrop-blur-sm">
            {insight.category}
          </span>
          <span className="font-label text-label-sm text-white/70">
            {formatDate(insight.date)}
          </span>
        </div>
        <h2 className="mb-sm max-w-2xl font-headline text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-display">
          {insight.title}
        </h2>
        <p className="mb-md line-clamp-2 max-w-xl text-body-md text-white/75 sm:text-body-lg">
          {insight.description}
        </p>
        <span className="inline-flex items-center gap-xs font-label text-label-sm uppercase text-white/90 transition-colors group-hover:text-white">
          기사 읽기
          <ArrowRight
            size={16}
            className="transition-transform group-hover:translate-x-1"
          />
        </span>
      </div>
    </Link>
  );
}
