import type { Config } from "tailwindcss";

/**
 * Sensorial Minimalism — 블랙&화이트 뉴트럴 스케일만 사용.
 * 장식 요소 없이 타이포그래피 비율과 여백으로만 위계를 만든다.
 */
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
          "Apple SD Gothic Neo",
          "Noto Sans KR",
          "sans-serif",
        ],
        serif: [
          "Georgia",
          "Times New Roman",
          "Noto Serif KR",
          "serif",
        ],
      },
      maxWidth: {
        article: "680px",
        shell: "1200px",
      },
      transitionTimingFunction: {
        sensorial: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
