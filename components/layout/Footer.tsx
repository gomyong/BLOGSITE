import Link from "next/link";
import { siteConfig } from "@/lib/site";

const columns = [
  {
    title: "Content",
    links: [
      { href: "/", label: "Articles" },
      { href: "/briefs", label: "Briefs" },
    ],
  },
  {
    title: "Site",
    links: [
      ...(siteConfig.shopEnabled ? [{ href: "/shop", label: "Shop" }] : []),
      { href: "/about", label: "About" },
    ],
  },
  {
    title: "Meta",
    links: [
      { href: "/privacy", label: "Privacy" },
      { href: "/sitemap.xml", label: "Sitemap" },
      { href: "/studio", label: "Studio" },
    ],
  },
];

/** X-style 대형 에디토리얼 푸터 — 브랜드 블록 + 링크 컬럼 */
export default function Footer() {
  return (
    <footer className="border-t border-outline-variant bg-surface-container-lowest">
      <div className="mx-auto max-w-container-max px-[20px] py-xl md:px-lg">
        <div className="grid grid-cols-1 gap-lg md:grid-cols-12">
          <div className="md:col-span-6">
            <p className="font-headline text-headline-lg font-extrabold tracking-tight text-on-surface">
              {siteConfig.name}
            </p>
            <p className="mt-sm max-w-sm text-body-md text-on-surface-variant">
              {siteConfig.tagline} — 기술과 브랜드의 흐름을 정밀하게 기록하는
              1인 미디어.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title} className="md:col-span-2">
              <p className="font-label text-label-sm uppercase tracking-widest text-on-surface-variant">
                {col.title}
              </p>
              <ul className="mt-sm space-y-xs">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-body-md text-on-surface transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-xl border-t border-outline-variant pt-md">
          <span className="font-label text-label-sm text-on-surface-variant">
            © {new Date().getFullYear()} {siteConfig.name}
          </span>
        </div>
      </div>
    </footer>
  );
}
