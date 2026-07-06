import Image from "next/image";
import Link from "next/link";
import type { MDXComponents } from "mdx/types";

/** 외부 링크는 새 탭, 내부 링크는 next/link로 처리 */
function CustomLink(props: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const href = props.href ?? "";
  if (href.startsWith("/")) {
    return (
      <Link
        href={href}
        {...props}
        className="font-medium text-accent underline underline-offset-4 dark:text-accent-dark"
      />
    );
  }
  return (
    <a
      {...props}
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-accent underline underline-offset-4 dark:text-accent-dark"
    />
  );
}

/** 본문 이미지 — next/image 최적화 + alt 텍스트를 캡션으로 렌더링 */
function CustomImage({ src, alt }: { src?: string; alt?: string }) {
  if (!src) return null;
  return (
    <figure className="my-8">
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl">
        <Image
          src={src}
          alt={alt ?? ""}
          fill
          sizes="(max-width: 720px) 100vw, 720px"
          className="object-cover"
        />
      </div>
      {alt && (
        <figcaption className="mt-3 text-center text-[13px] text-ink-400 dark:text-ink-500">
          {alt}
        </figcaption>
      )}
    </figure>
  );
}

function Blockquote(props: React.BlockquoteHTMLAttributes<HTMLQuoteElement>) {
  return (
    <blockquote
      {...props}
      className="my-8 border-l-2 border-accent py-1 pl-6 text-lg font-medium leading-relaxed text-ink-700 dark:border-accent-dark dark:text-ink-300"
    />
  );
}

export const mdxComponents: MDXComponents = {
  a: CustomLink,
  img: CustomImage as MDXComponents["img"],
  blockquote: Blockquote,
};
