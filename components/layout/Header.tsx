import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-neutral-100 bg-white/80 backdrop-blur-md dark:border-neutral-900 dark:bg-neutral-950/80">
      <div className="mx-auto flex h-16 max-w-shell items-center justify-between px-6 md:px-10">
        <Link
          href="/"
          className="text-sm font-bold uppercase tracking-[0.25em] text-neutral-900 dark:text-neutral-50"
        >
          Sensorial
        </Link>
        <nav className="flex items-center gap-8">
          <Link
            href="/blog"
            className="text-sm text-neutral-500 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-50"
          >
            Archive
          </Link>
          <Link
            href="/about"
            className="text-sm text-neutral-500 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-50"
          >
            About
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
