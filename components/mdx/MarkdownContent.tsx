import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import type { Components } from "react-markdown";

/** 외부 링크는 새 탭, 내부 링크는 next/link로 처리 */
function CustomLink(props: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const href = props.href ?? "";
  const className =
    "font-medium text-accent underline decoration-2 underline-offset-4 hover:opacity-80";
  if (href.startsWith("/")) {
    const { href: _ignored, ...rest } = props;
    return <Link {...rest} href={href} className={className} />;
  }
  return (
    <a {...props} target="_blank" rel="noopener noreferrer" className={className} />
  );
}

/** 본문 이미지 — next/image 최적화 + alt 텍스트를 캡션으로 렌더링 */
function CustomImage({ src, alt }: { src?: string | Blob; alt?: string }) {
  if (!src || typeof src !== "string") return null;
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
      className="my-8 border-l-2 border-accent bg-surface-container-low py-sm pl-md pr-sm text-[15px] font-medium leading-relaxed text-on-surface-variant"
    />
  );
}

const components: Components = {
  a: CustomLink,
  img: CustomImage as Components["img"],
  blockquote: Blockquote,
};

/**
 * 마크다운 본문 렌더러.
 * - remark-gfm: 취소선(~~), 표, 자동 링크 등 GFM 문법
 * - rehype-raw: 에디터가 남기는 인라인 HTML(<u>, 글자색 <span style>)을 안전하게 렌더링
 *   (본문은 스튜디오 관리자만 작성하므로 신뢰된 입력)
 */
export default function MarkdownContent({ source }: { source: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={components}
    >
      {source}
    </ReactMarkdown>
  );
}
