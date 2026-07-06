import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { siteConfig } from "@/lib/site";

const navItems = [
  { href: "/", label: "INSIGHTS" },
  { href: "/briefs", label: "BRIEFS" },
  { href: "/about", label: "ABOUT" },
];

export default function Header() {
  return (
    // 글래스모피즘은 내비게이션 헤더에만 허용 — 반투명 + 블러
    <header className="sticky top-0 z-40 border-b border-outline-variant bg-surface/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-container-max items-center justify-between px-[20px] md:px-lg">
        <Link
          href="/"
          className="font-headline text-lg font-extrabold tracking-tight text-primary"
        >
          {siteConfig.name}
        </Link>

        <div className="flex items-center gap-3 sm:gap-md">
          <nav className="hidden items-center gap-xs sm:flex md:gap-md">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-2 py-1 font-label text-label-sm uppercase text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <ThemeToggle />
          <Link
            href="/about#newsletter"
            className="hidden border border-primary-container bg-primary-container px-sm py-xs font-label text-label-sm text-white transition-colors hover:border-primary hover:bg-primary sm:block"
          >
            뉴스레터 구독
          </Link>
        </div>
      </div>
    </header>
  );
}
