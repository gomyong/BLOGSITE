import Image from "next/image";
import Link from "next/link";
import type { MDXComponents } from "mdx/types";

/** 외부 링크는 새 탭, 내부 링크는 next/link로 처리 */
function CustomLink(props: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const href = props.href ?? "";
  const className =
    "font-medium text-primary underline decoration-2 underline-offset-4 hover:text-primary-container";
  if (href.startsWith("/")) {
    return <Link href={href} {...props} className={className} />;
  }
  return (
    <a
      {...props}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    />
  );
}

/** 본문 이미지 — next/image 최적화 + alt 텍스트를 캡션으로 렌더링 */
function CustomImage({ src, alt }: { src?: string; alt?: string }) {
  if (!src) return null;
  return (
    <figure className="my-8">
      <div className="relative aspect-video w-full overflow-hidden border border-outline-variant">
        <Image
          src={src}
          alt={alt ?? ""}
          fill
          sizes="(max-width: 720px) 100vw, 720px"
          className="object-cover"
        />
      </div>
      {alt && (
        <figcaption className="mt-3 text-center font-label text-[13px] text-on-surface-variant">
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
      className="my-8 border-l-2 border-primary-container bg-surface-container-low py-sm pl-md pr-sm text-lg font-medium leading-relaxed text-on-surface-variant"
    />
  );
}

export const mdxComponents: MDXComponents = {
  a: CustomLink,
  img: CustomImage as MDXComponents["img"],
  blockquote: Blockquote,
};
