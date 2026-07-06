import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { InsightMeta } from "@/lib/mdx";
import { formatDate } from "@/lib/utils";

/** 디에디트 스타일 — 매거진 표지처럼 큰 썸네일의 Featured 아티클 */
export default function FeaturedArticle({ insight }: { insight: InsightMeta }) {
  return (
    <Link
      href={`/insight/${insight.slug}`}
      className="group relative block overflow-hidden rounded-3xl"
    >
      <div className="relative aspect-[16/10] w-full sm:aspect-[21/10]">
        <Image
          src={insight.coverImage}
          alt={insight.title}
          fill
          priority
          sizes="(max-width: 1152px) 100vw, 1152px"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      </div>

      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
        <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-widest text-white/70">
          <span className="rounded-full bg-white/15 px-3 py-1 backdrop-blur-sm">
            {insight.category}
          </span>
          <span>{formatDate(insight.date)}</span>
        </div>
        <h2 className="mt-4 max-w-3xl text-2xl font-extrabold leading-snug tracking-tightest text-white sm:text-4xl">
          {insight.title}
        </h2>
        <p className="mt-3 line-clamp-2 max-w-2xl text-sm leading-relaxed text-white/75 sm:text-base">
          {insight.description}
        </p>
        <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-white">
          아티클 읽기
          <ArrowUpRight
            size={16}
            className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </span>
      </div>
    </Link>
  );
}
