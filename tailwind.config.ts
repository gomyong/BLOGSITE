import type { Config } from "tailwindcss";

/**
 * "Technical Precision" 디자인 시스템
 * — 0px 직각 셰이프, Dark Topaz(#006D77) 프라이머리, 플랫/보더 기반 뎁스.
 * 색상 토큰은 globals.css의 CSS 변수(라이트/다크)를 참조한다.
 */
const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.mdx",
  ],
  theme: {
    // 셰이프 언어: 전면 Sharp(0px) — 모든 rounded-* 유틸을 0으로 고정
    borderRadius: {
      none: "0",
      sm: "0",
      DEFAULT: "0",
      md: "0",
      lg: "0",
      xl: "0",
      "2xl": "0",
      "3xl": "0",
      full: "0",
    },
    extend: {
      colors: {
        surface: "var(--surface)",
        "surface-dim": "var(--surface-dim)",
        "surface-container-lowest": "var(--surface-container-lowest)",
        "surface-container-low": "var(--surface-container-low)",
        "surface-container": "var(--surface-container)",
        "surface-container-high": "var(--surface-container-high)",
        "surface-container-highest": "var(--surface-container-highest)",
        "on-surface": "var(--on-surface)",
        "on-surface-variant": "var(--on-surface-variant)",
        outline: "var(--outline)",
        "outline-variant": "var(--outline-variant)",
        primary: "var(--primary)",
        "on-primary": "var(--on-primary)",
        "primary-container": "var(--primary-container)",
        "on-primary-container": "var(--on-primary-container)",
        "primary-fixed": "#9ff0fb",
        "primary-fixed-dim": "#82d3de",
        "on-primary-fixed": "#001f23",
        secondary: "var(--secondary)",
        "secondary-fixed": "#acefe7",
        "on-secondary-fixed": "#00201e",
        "on-secondary-fixed-variant": "#00504b",
        tertiary: "var(--tertiary)",
        "inverse-surface": "var(--inverse-surface)",
        "inverse-on-surface": "var(--inverse-on-surface)",
        error: "#ba1a1a",
      },
      fontFamily: {
        // 한글 타이포: Pretendard 전면 적용 / 라벨·코드: Geist
        sans: [
          "Pretendard Variable",
          "Pretendard",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "Apple SD Gothic Neo",
          "Noto Sans KR",
          "sans-serif",
        ],
        headline: [
          "Pretendard Variable",
          "Pretendard",
          "-apple-system",
          "system-ui",
          "Apple SD Gothic Neo",
          "sans-serif",
        ],
        label: ["Geist", "Pretendard Variable", "Pretendard", "sans-serif"],
        code: ["Geist Mono", "Geist", "monospace"],
      },
      spacing: {
        // 8px 기반 리듬 스케일
        xs: "8px",
        sm: "16px",
        md: "24px",
        lg: "48px",
        xl: "80px",
      },
      maxWidth: {
        "container-max": "1120px",
        "content-max": "720px",
      },
      fontSize: {
        display: [
          "34px",
          { lineHeight: "1.25", letterSpacing: "-0.02em", fontWeight: "800" },
        ],
        "headline-lg": [
          "23px",
          { lineHeight: "1.3", letterSpacing: "-0.02em", fontWeight: "700" },
        ],
        "headline-md": [
          "17px",
          { lineHeight: "1.4", letterSpacing: "-0.01em", fontWeight: "600" },
        ],
        "body-lg": ["15px", { lineHeight: "1.75", fontWeight: "400" }],
        "body-md": ["13.5px", { lineHeight: "1.65", fontWeight: "400" }],
        "label-sm": [
          "11px",
          { lineHeight: "1.2", letterSpacing: "0.05em", fontWeight: "500" },
        ],
      },
      typography: () => ({
        DEFAULT: {
          css: {
            maxWidth: "none",
            fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
            fontSize: "14.5px",
            lineHeight: "1.8",
            "--tw-prose-body": "var(--on-surface)",
            "--tw-prose-headings": "var(--on-surface)",
            "--tw-prose-bold": "var(--on-surface)",
            "--tw-prose-links": "var(--primary)",
            "--tw-prose-quotes": "var(--on-surface-variant)",
            "--tw-prose-quote-borders": "var(--primary-container)",
            "--tw-prose-counters": "var(--primary)",
            "--tw-prose-hr": "var(--outline-variant)",
            "--tw-prose-th-borders": "var(--outline-variant)",
            "--tw-prose-td-borders": "var(--outline-variant)",
            "h2, h3, h4": {
              fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
              letterSpacing: "-0.02em",
            },
            h2: { fontSize: "1.35em" },
            h3: { fontSize: "1.15em" },
            // 리스트: 프라이머리 틸 사각 불릿
            ul: { listStyleType: "square" },
            "ul > li::marker": { color: "var(--primary-container)" },
            blockquote: {
              fontStyle: "normal",
              fontWeight: "500",
              borderLeftWidth: "2px",
            },
            "blockquote p:first-of-type::before": { content: "none" },
            "blockquote p:last-of-type::after": { content: "none" },
            "code::before": { content: "none" },
            "code::after": { content: "none" },
            code: {
              fontFamily: "'Geist Mono', Geist, monospace",
              fontSize: "13px",
              backgroundColor: "var(--surface-container-low)",
              border: "1px solid var(--outline-variant)",
              borderRadius: "0",
              padding: "0.1rem 0.35rem",
              fontWeight: "400",
            },
            // 코드 블록: 좌측 프라이머리 틸 액센트 바 + 플랫 서피스
            pre: {
              fontFamily: "'Geist Mono', Geist, monospace",
              fontSize: "13px",
              lineHeight: "1.6",
              backgroundColor: "var(--surface-container-low)",
              color: "var(--on-surface)",
              border: "1px solid var(--outline-variant)",
              borderLeft: "3px solid var(--primary-container)",
              borderRadius: "0",
            },
            "pre code": {
              backgroundColor: "transparent",
              border: "none",
              padding: "0",
            },
            img: { borderRadius: "0" },
            a: { textUnderlineOffset: "4px" },
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
