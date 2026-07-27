#!/usr/bin/env bash
# BLOGSITE 검증 스크립트: 타입 에러와 빌드 실패를 확인합니다.
set -uo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
cd "$ROOT_DIR"

TYPECHECK_LOG="$(mktemp)"
BUILD_LOG="$(mktemp)"
trap 'rm -f "$TYPECHECK_LOG" "$BUILD_LOG"' EXIT

echo "=== 1) 의존성 설치 확인 ==="
if [ ! -d "node_modules" ]; then
  echo "node_modules가 없어 설치를 진행합니다 (npm install)..."
  if ! npm install; then
    echo "FAIL: npm install에 실패했습니다."
    exit 1
  fi
else
  echo "node_modules 확인됨. 설치를 건너뜁니다."
fi

echo ""
echo "=== 2) 타입 체크 (tsc --noEmit) ==="
if npx tsc --noEmit >"$TYPECHECK_LOG" 2>&1; then
  TYPECHECK_STATUS="PASS"
else
  TYPECHECK_STATUS="FAIL"
fi
cat "$TYPECHECK_LOG"

echo ""
echo "=== 3) 빌드 체크 (next build) ==="
if npm run build >"$BUILD_LOG" 2>&1; then
  BUILD_STATUS="PASS"
else
  BUILD_STATUS="FAIL"
fi
cat "$BUILD_LOG"

echo ""
echo "=== 검증 결과 요약 ==="
echo "타입 체크: $TYPECHECK_STATUS"
echo "빌드 체크: $BUILD_STATUS"

if [ "$TYPECHECK_STATUS" = "FAIL" ] || [ "$BUILD_STATUS" = "FAIL" ]; then
  exit 1
fi

exit 0
