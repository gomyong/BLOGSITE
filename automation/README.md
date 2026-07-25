# Auto-Brief 자동화

뉴스 RSS 피드를 수집해 **Gemini**로 요약하고, `content/briefs/`에 단신으로 발행하는
파이프라인입니다. GitHub Actions 크론으로 하루 3회(KST 07:30 / 12:30 / 18:30) 자동
실행됩니다. 설계 배경은 `../docs/PRD-brief-automation.md` 참조.

```
RSS 수집 → 중복/키워드 필터 → Gemini 요약 → 품질 검증 → MDX 커밋 → Vercel 자동 배포
```

## 최초 설정 (한 번만)

### 1. Gemini API 키 발급
[Google AI Studio](https://aistudio.google.com/apikey) → **Get API key** → 키 복사.
(무료 등급으로 이 규모 운영에 충분합니다.)

### 2. GitHub Secret 등록
저장소 → **Settings → Secrets and variables → Actions → New repository secret**
- Name: `GEMINI_API_KEY`
- Value: 발급받은 키

### 3. (선택) 동작 변수 — 같은 화면의 "Variables" 탭
| 변수 | 설명 | 기본값 |
| --- | --- | --- |
| `GEMINI_MODEL` | 사용할 모델 | `gemini-flash-lite-latest` |
| `CONFIDENCE_THRESHOLD` | 이 신뢰도 미만이면 발행 스킵 | `0.7` |

이게 전부입니다. 커밋 권한은 Actions 기본 토큰을 쓰므로 별도 설정이 없습니다.

### 비용 (2026-07-24 점검)

기존 기본값(`gemini-flash-latest`, 상위 Flash 모델)에서 비용이 예상보다 크게
나온 원인을 점검한 결과, 다음 두 가지를 확인·수정했다.

1. **"생각(thinking)" 토큰 미차단**: Gemini 2.5+ Flash 계열은 기본적으로 내부
   추론 토큰을 생성하고, 이 토큰도 출력 단가로 과금된다. 2~4문장 단신 요약처럼
   추론이 필요 없는 작업엔 순수 낭비다. → `generationConfig.thinkingConfig.
   thinkingBudget: 0`으로 명시 차단(코드 반영 완료). 이 한 가지만으로도 비용이
   크게 줄어들 가능성이 높다.
2. **모델 등급**: 상위 Flash 모델 대신 같은 계열의 **Flash-Lite**로 기본값을
   낮췄다(`gemini-flash-lite-latest`). Flash-Lite는 세대를 막론하고 입출력 단가가
   더 저렴하고, 이 파이프라인처럼 "제목+짧은 발췌 → 2~4문장 요약"인 단순 작업에는
   품질 차이가 거의 없는 것으로 알려져 있다.

⚠️ **주의**: Gemini 가격은 자주 바뀌고, 이 문서 작성 시점(2026-07)에 조사한
온라인 자료들 간에도 최신 세대(3.x) 모델 가격이 서로 어긋나 정확한 수치를
확정하지 못했다. 정확한 현재가는 항상
[공식 가격 페이지](https://ai.google.dev/gemini-api/docs/pricing)로 직접
확인할 것. 위 두 변경을 적용한 뒤 1~2일 실사용 비용을 지켜보고, 그래도
높으면 `max_items_per_run`/`max_items_per_source`를 낮춰 호출 자체를
줄이는 방법도 있다.

## 운영 방식

기본값은 **승인 모드(draft)** 입니다.
- 자동 생성된 단신은 `draft: true`로 커밋되어 **사이트에는 안 보입니다.**
- `사이트/studio` 대시보드의 Briefs 목록에 "초안" 배지로 뜹니다.
- 내용을 확인하고 **발행(비행기 아이콘)** 버튼을 누르면 사이트에 반영됩니다.
  (수정이 필요하면 연필 아이콘으로 편집 후 발행)

품질에 확신이 생기면 **Phase 2**로 전환하세요:
`sources.yml`의 신뢰하는 소스에 `auto_publish: true`를 추가하고, 워크플로를 `publish`
모드로 실행하면 그 소스는 초안을 거치지 않고 바로 발행됩니다.

## 소스 추가/변경

`sources.yml`을 편집하고 커밋하면 다음 실행부터 반영됩니다. **공식 RSS/Atom 피드** 또는
**공식 문서화된 공개 API**만 등록하세요(임의 스크래핑 금지, 저작권 정책은 PRD 7장 참조).

RSS가 없는 소스는 `type: huggingface` 같은 API 어댑터로 추가할 수 있습니다(예:
Hugging Face 트렌딩/신규 모델·데이터셋). 필드 설명은 `sources.yml` 상단 주석 참조.

## 수동 실행 / 테스트

저장소 **Actions → Auto-Brief → Run workflow** 에서 즉시 실행할 수 있습니다.
- `mode`: draft(기본) / publish
- `dry_run`: true면 커밋 없이 로그만 (파이프라인 점검용)

로컬 테스트:
```bash
cd automation
npm install
DRY_RUN=1 node generate-briefs.mjs          # 키 없이 흐름만 점검
GEMINI_API_KEY=... node generate-briefs.mjs  # 실제 요약까지
```

## 안전장치

- **중복 방지**: `briefs-seen.json`(URL 해시, 60일 보관)으로 같은 기사 재발행 차단
- **품질 게이트**: 길이·신뢰도 미달 시 스킵 (오발행보다 미발행 우선)
- **원문 미크롤링**: 피드가 제공하는 제목·요약만 입력, 원문 전재 없음
- **출처 표기**: 모든 자동 단신에 매체명 + 원문 링크 필수
- **킬 스위치**: `.github/workflows/auto-brief.yml`의 `schedule` 주석 처리 또는
  Actions 탭에서 워크플로 Disable
