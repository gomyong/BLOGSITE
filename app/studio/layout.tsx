import type { Metadata } from "next";
import Link from "next/link";
import { PenLine } from "lucide-react";

export const metadata: Metadata = {
  title: "Studio",
  robots: { index: false, follow: false },
};

/** 스튜디오 전용 미니멀 레이아웃 — 공개 사이트 헤더/푸터 없이 집중 모드 */
export default function StudioLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-outline-variant bg-surface/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-container-max items-center justify-between px-[20px] md:px-lg">
          <Link
            href="/studio"
            className="flex items-center gap-xs font-headline text-base font-extrabold tracking-tight text-on-surface"
          >
            <PenLine size={16} className="text-primary" />
            Studio
          </Link>
          <Link
            href="/"
            className="font-label text-label-sm uppercase text-on-surface-variant transition-colors hover:text-primary"
          >
            사이트 보기 →
          </Link>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
