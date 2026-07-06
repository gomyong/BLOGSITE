import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.mdx",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Pretendard Variable",
          "Pretendard",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "Roboto",
          "Helvetica Neue",
          "Segoe UI",
          "Apple SD Gothic Neo",
          "Noto Sans KR",
          "Malgun Gothic",
          "sans-serif",
        ],
      },
      colors: {
        ink: {
          50: "#f7f7f8",
          100: "#eeeef0",
          200: "#d9d9de",
          300: "#b8b8c1",
          400: "#92929e",
          500: "#747483",
          600: "#5e5e6b",
          700: "#4d4d57",
          800: "#2b2b31",
          900: "#1a1a1e",
          950: "#101013",
        },
        accent: {
          DEFAULT: "#e8590c",
          soft: "#fff0e6",
          dark: "#ff8a4c",
        },
      },
      letterSpacing: {
        tightest: "-0.04em",
      },
      typography: () => ({
        DEFAULT: {
          css: {
            maxWidth: "none",
            "--tw-prose-body": "#2b2b31",
            "--tw-prose-headings": "#101013",
            "--tw-prose-quotes": "#4d4d57",
            "--tw-prose-quote-borders": "#e8590c",
            "--tw-prose-invert-body": "#d9d9de",
            "--tw-prose-invert-headings": "#f7f7f8",
            "--tw-prose-invert-quotes": "#b8b8c1",
            "--tw-prose-invert-quote-borders": "#ff8a4c",
            lineHeight: "1.85",
            letterSpacing: "-0.01em",
            "h2, h3": {
              letterSpacing: "-0.02em",
            },
            blockquote: {
              fontStyle: "normal",
              fontWeight: "500",
            },
            "blockquote p:first-of-type::before": { content: "none" },
            "blockquote p:last-of-type::after": { content: "none" },
            "code::before": { content: "none" },
            "code::after": { content: "none" },
            code: {
              backgroundColor: "#eeeef0",
              borderRadius: "0.25rem",
              padding: "0.15rem 0.4rem",
              fontWeight: "500",
            },
            img: {
              borderRadius: "0.5rem",
            },
          },
        },
        invert: {
          css: {
            code: {
              backgroundColor: "#2b2b31",
            },
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
