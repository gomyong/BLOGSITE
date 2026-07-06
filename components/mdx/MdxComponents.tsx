import type { MDXComponents } from "mdx/types";
import RevealBlock from "./RevealBlock";

/**
 * PRD 3.2 — 본문 블록 단위 Scroll Reveal.
 * 문단·헤딩·인용구·이미지가 스크롤 진입 시 페이드인 + 블러 해제된다.
 * 세부 타이포그래피는 globals.css의 .article-body 규칙이 담당한다.
 */
export const mdxComponents: MDXComponents = {
  p: ({ children }) => (
    <RevealBlock>
      <p>{children}</p>
    </RevealBlock>
  ),
  h2: ({ children }) => (
    <RevealBlock>
      <h2>{children}</h2>
    </RevealBlock>
  ),
  h3: ({ children }) => (
    <RevealBlock>
      <h3>{children}</h3>
    </RevealBlock>
  ),
  blockquote: ({ children }) => (
    <RevealBlock>
      <blockquote>{children}</blockquote>
    </RevealBlock>
  ),
  ul: ({ children }) => (
    <RevealBlock>
      <ul>{children}</ul>
    </RevealBlock>
  ),
  ol: ({ children }) => (
    <RevealBlock>
      <ol>{children}</ol>
    </RevealBlock>
  ),
  pre: ({ children }) => (
    <RevealBlock>
      <pre>{children}</pre>
    </RevealBlock>
  ),
  img: (props) => (
    <RevealBlock>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img {...props} alt={props.alt ?? ""} loading="lazy" />
    </RevealBlock>
  ),
  hr: () => (
    <RevealBlock>
      <hr />
    </RevealBlock>
  ),
};
