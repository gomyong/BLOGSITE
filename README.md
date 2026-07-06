# UNDERLINE — Tech & Brand Insight Media Platform

기술 · 테크 · 브랜드 · 기업 비즈니스 트렌드를 다루는 1인 미디어 플랫폼입니다.
PRD(Product Requirements Document)를 기반으로 구현되었으며, 파일 기반 MDX 콘텐츠와
정적 사이트 생성(SSG)으로 **호스팅/DB 비용 $0**를 유지합니다.

## 핵심 기능

- **듀얼 타임라인** — 심층 아티클 `Insights` + 단신 뉴스 `Briefs` 분리 제공
- **X-style 에디토리얼 레이아웃** — 대형 인트로, 카테고리 필터, 분할형 피처드, 2열 그리드
- **내장 CMS(스튜디오)** — `/studio`에서 브런치/미디엄처럼 글 작성·수정·삭제. 발행 시 GitHub 커밋 → Vercel 자동 재배포 (DB 불필요)
- **읽기 경험 최적화** — 본문 최대 너비 720px, 읽기 진행률 바, 이전/다음 글 내비게이션
- **뉴스레터 구독** — 본문 30% 지점 및 최하단 폼 (Resend 연동 지원)
- **다크모드** — 시스템 설정 감지 + 수동 토글, FOUC 방지
- **SEO** — `generateMetadata`, Canonical URL, OG/Twitter 카드, `sitemap.ts`, `robots.ts`, Article/NewsArticle JSON-LD

## 기술 스택

| 영역 | 선택 |
| --- | --- |
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + @tailwindcss/typography |
| Content | Local MDX (`gray-matter` + `next-mdx-remote`) |
| Icons | Lucide React |
| Fonts | Pretendard Variable (CDN) |
| Deployment | Vercel (Hobby 플랜) |

## 시작하기

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # 프로덕션 빌드 (SSG)
```

## 콘텐츠 작성

### Insights (심층 아티클) — `content/insights/*.mdx`

```yaml
---
title: "아티클 제목"
description: "요약 (SEO 메타 디스크립션으로 사용)"
date: "2026-07-06"
category: "Brand"
tags: ["Apple", "UX"]
coverImage: "/images/insights/cover.jpg"
featured: true   # true면 메인 Hero 영역에 노출
author: "운영자"
---
```

### Briefs (단신 뉴스) — `content/briefs/*.mdx`

```yaml
---
date: "2026-07-06T14:30:00+09:00"
tags: ["Tech News", "AI"]
link: "https://external-source.com"   # (선택) 원문 링크
---
본문 텍스트. 제목이 없으므로 첫 100자가 메타 디스크립션으로 자동 추출됩니다.
```

## 환경변수

| 변수 | 설명 |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | 배포 도메인 (canonical/sitemap에 사용) |
| `ADMIN_PASSWORD` | 스튜디오(`/studio`) 로그인 비밀번호 — 설정해야 CMS 활성화 |
| `GITHUB_TOKEN` | 발행용 fine-grained PAT (Contents: Read/Write) |
| `GITHUB_REPO` | 발행 대상 저장소 (예: `gomyong/BLOGSITE`) |
| `GITHUB_BRANCH` | 커밋 브랜치 (기본 `main`) |
| `RESEND_API_KEY` | Resend API 키 (미설정 시 구독은 데모 모드로 동작) |
| `RESEND_AUDIENCE_ID` | Resend Audience ID |

글 작성 방법은 `content/WRITING_GUIDE.md` 참조.

## 폴더 구조

```
├── app/
│   ├── insight/[slug]/page.tsx   # 아티클 상세 (SEO 메타 + JSON-LD)
│   ├── briefs/page.tsx           # 단신 전체 (페이지네이션)
│   ├── about/page.tsx
│   ├── api/subscribe/route.ts    # 뉴스레터 구독 API
│   ├── layout.tsx / page.tsx
│   └── sitemap.ts / robots.ts
├── components/
│   ├── layout/    # Header, Footer, NewsletterForm, ThemeToggle
│   ├── insight/   # InsightCard, FeaturedArticle, ReadingProgress
│   ├── briefs/    # BriefItem
│   └── mdx/       # MDX 커스텀 렌더링 컴포넌트
├── content/
│   ├── insights/  # 심층 아티클 .mdx
│   └── briefs/    # 단신 .mdx
├── lib/           # mdx.ts (파싱), utils.ts, site.ts (사이트 설정)
└── public/images/
```
