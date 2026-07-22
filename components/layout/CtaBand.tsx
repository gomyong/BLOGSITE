import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * CLIP 스타일 CTA 밴드 — 컬러(accent) 라운드 밴드 + 큰 헤드라인 + 다크 pill 버튼,
 * 뒤에 거대한 워터마크 이니셜.
 */
export default function CtaBand({
  eyebrow,
  title,
  description,
  href,
  cta,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  href: string;
  cta: string;
}) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-accent px-6 py-xl text-center sm:px-lg">
      {/* 워터마크 */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center font-headline text-[38vw] font-extrabold leading-none text-black/[0.06] sm:text-[300px]"
      >
        +
      </span>
      <div className="relative mx-auto max-w-xl">
        {eyebrow && (
          <p className="font-label text-[12px] uppercase tracking-widest text-black/60">
            {eyebrow}
          </p>
        )}
        <h2 className="mt-2 font-headline text-[28px] font-extrabold leading-[1.15] tracking-tight text-black sm:text-[40px]">
          {title}
        </h2>
        <p className="mx-auto mt-3 max-w-md text-[14px] leading-relaxed text-black/70">
          {description}
        </p>
        <Link
          href={href}
          className="mt-lg inline-flex items-center gap-2 rounded-full bg-black px-5 py-2.5 text-[14px] font-semibold text-white transition-transform hover:translate-x-0.5"
        >
          {cta} <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}
