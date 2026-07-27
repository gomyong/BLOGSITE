#!/usr/bin/env bash
# Stop 훅: 이번 턴에서 코드/설정 파일이 바뀌었을 때만 검증 스킬(check.sh)을 자동 실행한다.
# FAIL이면 exit 2로 Claude의 응답 종료를 막고 에러 내용을 되돌려줘서 스스로 고치게 한다.
set -uo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

INPUT="$(cat)"

# 이미 이 Stop 훅이 한 번 개입해 이어진 턴이면 무한 루프를 막기 위해 재검사하지 않는다.
if echo "$INPUT" | grep -q '"stop_hook_active"[[:space:]]*:[[:space:]]*true'; then
  exit 0
fi

CHECK_SCRIPT="$ROOT_DIR/.claude/skills/verification/check.sh"
if [ ! -f "$CHECK_SCRIPT" ]; then
  exit 0
fi

# Next.js/TypeScript 스택에 영향을 주는 파일이 이번 세션에서 바뀌었는지 확인.
CHANGED_FILES="$(git status --porcelain -- \
  '*.ts' '*.tsx' '*.js' '*.jsx' '*.mjs' '*.cjs' \
  'package.json' 'package-lock.json' 'tsconfig.json' \
  'next.config.mjs' 'postcss.config.mjs' 'tailwind.config.ts' \
  2>/dev/null || true)"

if [ -z "$CHANGED_FILES" ]; then
  exit 0
fi

OUTPUT="$(bash "$CHECK_SCRIPT" 2>&1)"
STATUS=$?

if [ $STATUS -ne 0 ]; then
  {
    echo "[stop-verification] 코드 변경이 감지되어 자동 검증을 실행했지만 실패했습니다."
    echo "아래 로그를 확인해 원인을 고친 뒤, 다시 검증 스킬을 실행해서 통과하는지 확인하고,"
    echo "그 결과를 비개발자인 사용자에게 쉬운 말로 요약해서 알려주세요."
    echo ""
    echo "$OUTPUT" | tail -150
  } >&2
  exit 2
fi

exit 0
