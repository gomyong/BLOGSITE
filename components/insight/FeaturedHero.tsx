import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { InsightMeta } from "@/lib/mdx";
import { formatDate } from "@/lib/utils";

/**
 * CLIP 스타일 피처드 히어로 — 컬러(accent) 블록 위에 제목, 우측에 컷아웃 이미지.
 * 뒤에 살짝 어긋난 다크 셰이프를 겹쳐 콜라주 느낌을 준다.
 */
export default function FeaturedHero({ insight }: { insight: InsightMeta }) {
  return (
    <Link
      href={`/insight/${insight.slug}`}
      className="group relative block overflow-hidden rounded-2xl bg-accent"
    >
      <div className="grid items-stretch gap-0 md:grid-cols-2">
        {/* 텍스트 */}
        <div className="flex flex-col justify-between p-lg sm:p-xl">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="chip chip-on-accent">{insight.category}</span>
            <span className="chip chip-on-accent">
              {formatDate(insight.date)}
            </span>
          </div>
          <div className="mt-lg">
            <h2 className="font-headline text-[26px] font-extrabold leading-[1.15] tracking-tight text-white sm:text-[34px]">
              {insight.title}
            </h2>
            <p className="mt-sm max-w-md text-[14px] leading-relaxed text-white/90">
              {insight.description}
            </p>
            <span className="mt-md inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-[13px] font-semibold text-black transition-transform group-hover:translate-x-0.5">
              기사 읽기 <ArrowRight size={15} />
            </span>
          </div>
        </div>

        {/* 이미지 (콜라주 느낌) */}
        <div className="relative min-h-[240px] md:min-h-[380px]">
          <div className="absolute inset-4 rotate-2 rounded-xl bg-black/20" />
          <div className="absolute inset-4 overflow-hidden rounded-xl">
            <Image
              src={insight.coverImage}
              alt={insight.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 560px"
              className="object-cover grayscale transition-all duration-700 group-hover:scale-[1.04] group-hover:grayscale-0"
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
