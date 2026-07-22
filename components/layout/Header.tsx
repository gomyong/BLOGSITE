import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { siteConfig } from "@/lib/site";

const navItems = [
  { href: "/", label: "Articles" },
  { href: "/briefs", label: "Briefs" },
  ...(siteConfig.shopEnabled ? [{ href: "/shop", label: "Shop" }] : []),
  { href: "/about", label: "About" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-outline-variant bg-surface/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-container-max items-center justify-between px-[20px] md:px-lg">
        {/* 스택형 로고 (CLIP 스타일) */}
        <Link href="/" className="group flex items-end leading-none">
          <span className="font-headline text-[15px] font-extrabold tracking-tight text-on-surface">
            TEAL+DOT
          </span>
          <span className="ml-[2px] mb-[1px] h-[4px] w-[4px] rounded-full bg-accent" />
        </Link>

        {/* 중앙 내비 */}
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-1.5 text-[13px] font-medium text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-on-surface"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          {/* 모바일 내비 */}
          <nav className="flex items-center gap-1 md:hidden">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-2 py-1 text-[12px] font-medium text-on-surface-variant hover:text-on-surface"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
