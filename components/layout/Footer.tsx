import Link from "next/link";
import { siteConfig } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="border-t border-outline-variant bg-surface-container-lowest">
      <div className="mx-auto flex max-w-container-max flex-col justify-between gap-md px-[20px] py-lg md:flex-row md:items-center md:px-lg">
        <div>
          <p className="font-headline text-headline-md font-bold text-on-surface">
            {siteConfig.name}
          </p>
          <p className="mt-xs text-body-md text-primary">
            © {new Date().getFullYear()} {siteConfig.name}. 정밀하게
            구축되었습니다.
          </p>
        </div>
        <div className="flex gap-md">
          <Link
            href="/briefs"
            className="font-label text-label-sm uppercase text-on-surface-variant underline decoration-2 underline-offset-4 transition-colors hover:text-primary"
          >
            Briefs
          </Link>
          <Link
            href="/about"
            className="font-label text-label-sm uppercase text-on-surface-variant underline decoration-2 underline-offset-4 transition-colors hover:text-primary"
          >
            About
          </Link>
          <a
            href="/sitemap.xml"
            className="font-label text-label-sm uppercase text-on-surface-variant underline decoration-2 underline-offset-4 transition-colors hover:text-primary"
          >
            Sitemap
          </a>
        </div>
      </div>
    </footer>
  );
}
