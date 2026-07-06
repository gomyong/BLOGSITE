# Sensorial — Text & Tech Minimal Blog

기술·디자인·브랜드의 교차점을 다루는 텍스트 에세이 플랫폼.
PRD "센서리얼 텍스트 & 테크 미니멀 블로그 v1.0"을 기반으로 구현했다.

## 디자인 원칙

- **Sensory Minimalism** — 블랙&화이트 뉴트럴 팔레트, 장식 없이 타이포그래피 비율과 여백만으로 위계 구성 (x.company/blog 벤치마킹)
- **폰트** — Pretendard Variable (다이나믹 서브셋 CDN), 인용구는 세리프 이탈릭
- **본문 규격** — `max-w-[680px]` 단일 컬럼, 17~18px / 행간 1.8, 섹션 간격 `py-16 md:py-24`
- **다크 모드** — class 전략 + 시스템 선호 감지 + 토글

## 기술 스택

- Next.js 15 (App Router, React Server Components)
- Tailwind CSS + Framer Motion
- 콘텐츠: `content/posts/*.mdx` 파일 기반 (next-mdx-remote)

## 구현된 PRD 기능

| PRD | 구현 |
|---|---|
| 3.2 Article View 레이아웃 | Category → H1 → Date·Reading Time 헤더, 680px 본문 (`app/blog/[slug]/page.tsx`) |
| 3.2 Scroll-driven Text Reveal | 블록 단위 fade-in + unblur, `y:15 / blur(4px)` 스펙 (`components/mdx/RevealBlock.tsx`) |
| 3.2 Top Progress Bar | 1px 고정 독서 진행률 바 (`components/article/ProgressBar.tsx`) |
| 3.2 Blockquote | 좌측 보더 없는 세리프 이탈릭 (`globals.css .article-body blockquote`) |
| 3.3 다차원 필터 | 카테고리(단일) + 태그(다중, AND) + 검색어 (`lib/posts.ts filterPosts`) |
| 3.3 URL 쿼리 매핑 | `/blog?category=Design&tags=Branding,UX&q=minimal` 공유 가능 (`components/blog/FilterBar.tsx`) |
| 3.3 검색 디바운스 | 300ms 타이핑 유예 |
| 3.3 Empty State | 결과 0건 시 상위 태그 5개 칩 큐레이션 |
| 3.1 예상 독서 시간 | `Math.ceil(단어수 / 200)` 자동 계산 |
| 4 DB 스키마 | `supabase/schema.sql` (FTS Generated Column + GIN 인덱스 + RLS) |

### 단계적 확장 (Supabase 연동 시)

현재 버전은 파일 기반 콘텐츠 스토어로 동작한다. `lib/posts.ts`의 `filterPosts`는
PRD의 Supabase 쿼리(`tags @>`, `fts_vector @@`)와 동일한 의미론으로 작성되어 있어,
`supabase/schema.sql` 적용 후 데이터 소스만 교체하면 된다. Tiptap 기반 블록 에디터와
Debounced Auto-Save(3.1)는 Supabase 연동 단계에서 함께 구현한다.

## 실행

```bash
npm install
npm run dev    # http://localhost:3000
npm run build  # 프로덕션 빌드 (전체 정적 생성)
```

## 글 작성

`content/posts/슬러그.mdx` 파일을 추가한다. 파일명이 URL 슬러그가 된다.

```mdx
---
title: "글 제목"
summary: "목록과 메타 태그에 쓰이는 요약"
category: "Tech"          # 단일 카테고리
tags: ["React", "Search"]  # 다중 태그
date: "2026-07-06"
---

본문 마크다운...
```
