import Link from "next/link";
import { siteConfig } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="border-t border-ink-100 dark:border-ink-800">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold tracking-tight text-ink-950 dark:text-white">
            {siteConfig.name}
            <span className="text-accent dark:text-accent-dark">.</span>
          </p>
          <p className="mt-1 text-xs leading-relaxed text-ink-400 dark:text-ink-500">
            {siteConfig.tagline} — 기술과 브랜드의 흐름에 밑줄을 긋습니다.
          </p>
        </div>
        <div className="flex items-center gap-5 text-xs text-ink-400 dark:text-ink-500">
          <Link href="/about" className="hover:text-ink-900 dark:hover:text-ink-100">
            About
          </Link>
          <Link href="/briefs" className="hover:text-ink-900 dark:hover:text-ink-100">
            Briefs
          </Link>
          <span>© {new Date().getFullYear()} {siteConfig.name}</span>
        </div>
      </div>
    </footer>
  );
}
