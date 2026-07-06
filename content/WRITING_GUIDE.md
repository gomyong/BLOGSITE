# 블로그 글 작성 가이드

글을 쓰는 방법은 두 가지입니다. **①스튜디오(추천)** 또는 **②파일 직접 작성**.

---

## 1. 스튜디오에서 쓰기 (추천 — 브런치/미디엄처럼)

사이트에 내장된 관리 화면입니다. 파일이나 git을 몰라도 됩니다.

### 첫 설정 (한 번만)

Vercel 대시보드 → Settings → Environment Variables에 3개를 추가하고 재배포:

| 변수 | 값 | 용도 |
| --- | --- | --- |
| `ADMIN_PASSWORD` | 원하는 비밀번호 | 스튜디오 로그인 |
| `GITHUB_TOKEN` | GitHub fine-grained PAT | 발행(저장소 커밋) 권한 |
| `GITHUB_REPO` | `gomyong/BLOGSITE` | 발행 대상 저장소 |

> **GITHUB_TOKEN 만들기**: GitHub → Settings → Developer settings →
> Fine-grained tokens → Generate new token → Repository access에서
> `BLOGSITE`만 선택 → Permissions에서 **Contents: Read and write** 부여.

### 사용법

1. `사이트주소/studio` 접속 → 비밀번호 입력
2. **새 아티클** 또는 **새 브리프** 클릭
3. 제목/본문을 그냥 입력 (마크다운 지원: `## 소제목`, `**굵게**`, `> 인용`, `- 리스트`)
4. 상단 **설정**에서 카테고리·태그·요약·대표글(Featured) 지정, **커버 이미지 추가**로 업로드
5. **발행** 클릭 → 저장소에 자동 커밋 → **1~2분 뒤 사이트에 반영**
6. **초안 저장**을 누르면 사이트에 노출되지 않는 초안으로 보관됩니다

대시보드에서 기존 글 수정(연필)·삭제(휴지통)도 가능합니다.

---

## 2. 파일로 직접 쓰기 (개발자용)

`content/insights/` 또는 `content/briefs/`에 `.mdx` 파일을 만들어 push해도 됩니다.
파일명이 곧 URL입니다 (`apple-vision.mdx` → `/insight/apple-vision`).

### Insights frontmatter

```yaml
---
title: "글 제목"
description: "한 줄 요약 (SEO)"
date: "2026-07-06"
category: "Brand"
tags: ["Apple", "UX"]
coverImage: "/images/insights/cover.svg"
featured: true      # 메인 상단 대표 영역 노출 (최신 2개)
author: "에디터"
# draft: true       # 초안 — 사이트에 노출 안 됨
---

본문...
```

### Briefs frontmatter (제목 없음)

```yaml
---
date: "2026-07-06T14:30:00+09:00"   # 시간까지 — "2시간 전"으로 표시
tags: ["Tech News"]
link: "https://원문-링크"             # 선택
---
단신 본문. 첫 100자가 요약으로 자동 사용됩니다.
```

이미지는 `public/images/` 아래에 두고 `/images/...` 경로로 참조합니다.
정렬·목록·SEO·사이트맵은 전부 자동입니다.
