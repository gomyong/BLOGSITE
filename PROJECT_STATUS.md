# 프로젝트 진행 상황 (PROJECT STATUS)

> TECH+DESIGN — Tech & Brand Insight 미디어 플랫폼
> 최종 업데이트: 2026-07-07

이 문서는 지금까지 완료한 작업과 앞으로 할 일을 한곳에 정리한 것입니다.
세부 설계는 `docs/`, 사용법은 `README.md` / `content/WRITING_GUIDE.md` /
`automation/README.md`를 참조하세요.

---

## 1. 완료된 작업 ✅

### 기반 (Foundation)
- Next.js 15 (App Router) + TypeScript + Tailwind CSS 정적 사이트(SSG)
- 파일 기반 MDX 콘텐츠 (`content/insights`, `content/briefs`), 초안(draft) 지원
- Vercel Hobby 배포 (월 $0), `main` 브랜치 자동 재배포

### 콘텐츠 구조
- **Insights** (심층 아티클) — 커버 이미지, 카테고리, 태그, featured, 읽기 시간
- **Briefs** (단신) — 제목 없는 짧은 글, 상대 시간, 출처/원문 링크
- 상세 페이지: 읽기 진행률 바, 이전/다음 글, 720px 리딩 레일

### 디자인
- 모노크롬(블랙&화이트) + 절제된 청록(teal) 액센트
- Pretendard(한글) / Geist(라벨·코드), 90도 직각(0px) 셰이프
- X-style 에디토리얼 레이아웃 (카테고리 필터 + 분할 피처드 + 2열 그리드)
- 다크모드 (시스템 감지 + 토글, FOUC 방지)

### 내장 CMS — 스튜디오 (`/studio`)
- 비밀번호 로그인 (ADMIN_PASSWORD, HMAC 세션 쿠키)
- 대시보드 (글 목록 / 수정 / 삭제 / 초안 발행)
- Medium·브런치 스타일 에디터 (무테두리 제목·본문, 미리보기, 설정 패널, 커버 업로드)
- 발행 시 GitHub Contents API로 MDX 커밋 → Vercel 자동 재배포 (DB 불필요)
- 로컬 fs 폴백 (개발용)

### Briefs 자동화 — Auto-Brief (`automation/`)
- GitHub Actions 크론 (KST 07:30 / 12:30 / 18:30 + 수동 실행)
- 공식 RSS 피드 수집 → **Gemini** 요약 → 품질 검증 → MDX 커밋
- 승인 모드(초안 발행) 기본, 신뢰 소스 즉시 발행(Phase 2) 옵션
- URL 해시 중복 방지, 저작권 가드레일(피드 전용·출처 표기)

### 기본 SEO
- `generateMetadata` (동적 title/description), canonical URL
- `sitemap.ts`, `robots.ts`
- Article/NewsArticle JSON-LD

---

## 2. 배포·운영 현황 🚀

- 배포 주소: `https://blogsite-woad-sigma.vercel.app`
- 브랜치: `main` (푸시 시 자동 배포)
- **주의**: 샘플 콘텐츠(아티클 6 / 브리프 12)가 올라가 있음 → 실제 운영 시 교체 필요

---

## 3. 앞으로 할 일 (Backlog) 📋

### A. 코드로 개선 가능 — SEO/AEO 강화 (진행 중)
| # | 항목 | 상태 | 비고 |
|---|---|---|---|
| A1 | 동적 OG 이미지 생성 (`ImageResponse`) | ⬜ 예정 | SVG는 소셜 미리보기 안 뜸 → PNG 자동 생성 |
| A2 | 검색엔진 소유권 확인 태그 (env 기반) | ⬜ 예정 | Google / 네이버 verification |
| A3 | AEO 엔티티 강화 (Organization/Person schema, `sameAs`, 로고) | ⬜ 예정 | AI 답변엔진 신뢰 신호 |
| A4 | `dateModified` 추가 | ⬜ 예정 | 최신성 신호 |
| A5 | `llms.txt` 생성 | ⬜ 예정 | AI 크롤러 관례 파일 |
| A6 | 사이트 RSS 피드 (`/feed.xml`) | ⬜ 예정 | 배포 채널 + AEO |

### B. 사용자 액션 필요 (코드 아님)
| # | 항목 | 비고 |
|---|---|---|
| B1 | `NEXT_PUBLIC_SITE_URL` 환경변수 설정 | **최우선** — canonical/sitemap/OG 정확도 |
| B2 | 스튜디오 환경변수 (`ADMIN_PASSWORD`, `GITHUB_TOKEN`, `GITHUB_REPO`) | CMS 사용 시 |
| B3 | `GEMINI_API_KEY` 등록 | 자동 브리프 사용 시 |
| B4 | Google Search Console + 네이버 서치어드바이저 등록 → 사이트맵 제출 | 검색 노출 |
| B5 | 샘플 콘텐츠 삭제 후 실제 글 작성 | 운영 시작 |
| B6 | (선택) 커스텀 도메인 연결 | |

### C. 향후 검토 (Nice-to-have)
- 조회수/애널리틱스 (Vercel Analytics 무료 티어)
- 아티클 목차(TOC) 자동 생성
- 관련 글 추천
- Auto-Brief 사건 단위 중복 제거(임베딩 유사도)

---

## 4. 참고 문서
- `README.md` — 프로젝트 개요·환경변수·폴더 구조
- `content/WRITING_GUIDE.md` — 글 작성법 (스튜디오 / 파일)
- `docs/PRD-brief-automation.md` — Briefs 자동화 상세 설계
- `automation/README.md` — 자동화 설정·운영
