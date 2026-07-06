import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { siteConfig } from "@/lib/site";

const navItems = [
  { href: "/", label: "Insights" },
  { href: "/briefs", label: "Briefs" },
  { href: "/about", label: "About" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink-100 bg-white/80 backdrop-blur-md dark:border-ink-800 dark:bg-ink-950/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link
          href="/"
          className="text-xl font-extrabold tracking-tightest text-ink-950 dark:text-white"
        >
          {siteConfig.name}
          <span className="text-accent dark:text-accent-dark">.</span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-4">
          <nav className="flex items-center gap-4 text-sm font-medium text-ink-500 sm:gap-6 dark:text-ink-400">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition-colors hover:text-ink-950 dark:hover:text-white"
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
