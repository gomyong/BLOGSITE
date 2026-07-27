#!/usr/bin/env bash
# PostToolUse 훅: Edit/Write로 방금 수정한 파일을 Prettier로 자동 포맷하고,
# JS/TS 파일이면 ESLint --fix까지 실행한다.
# ESLint가 자동으로 못 고치는 문제가 남으면 exit 2로 Claude에게 되돌려 스스로 고치게 한다.
set -uo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

INPUT="$(cat)"

FILE_PATH="$(node -e '
  let raw = "";
  process.stdin.on("data", (c) => (raw += c));
  process.stdin.on("end", () => {
    try {
      const data = JSON.parse(raw);
      const p = data.tool_input && data.tool_input.file_path;
      process.stdout.write(typeof p === "string" ? p : "");
    } catch (e) {
      /* 파싱 실패 시 빈 문자열 */
    }
  });
' <<< "$INPUT")"

if [ -z "$FILE_PATH" ]; then
  exit 0
fi

# 프로젝트 루트 기준 상대경로로 변환. 프로젝트 밖 파일은 건드리지 않는다.
case "$FILE_PATH" in
  "$ROOT_DIR"/*) REL_PATH="${FILE_PATH#"$ROOT_DIR"/}" ;;
  /*) exit 0 ;;
  *) REL_PATH="$FILE_PATH" ;;
esac

if [ ! -f "$REL_PATH" ]; then
  exit 0
fi

# 포맷/린트 대상에서 제외할 경로 (빌드 산출물, 정적 파일, 블로그 콘텐츠, 잠금 파일 등)
case "$REL_PATH" in
  node_modules/*|.next/*|public/*|content/*|automation/briefs-seen.json|package-lock.json)
    exit 0
    ;;
esac

EXT="${REL_PATH##*.}"
FORMAT_STATUS=0
LINT_STATUS=0
LINT_LOG=""

case "$EXT" in
  ts|tsx|js|jsx|mjs|cjs|json|css|md|mdx)
    npx --no-install prettier --write "$REL_PATH" >/dev/null 2>&1 || FORMAT_STATUS=1
    ;;
esac

case "$EXT" in
  ts|tsx|js|jsx|mjs|cjs)
    if [ -f "eslint.config.mjs" ]; then
      LINT_LOG="$(npx --no-install eslint "$REL_PATH" --fix 2>&1)" || LINT_STATUS=1
    fi
    ;;
esac

if [ "$FORMAT_STATUS" -ne 0 ] || [ "$LINT_STATUS" -ne 0 ]; then
  {
    echo "[post-format] $REL_PATH 파일을 자동으로 완전히 정리하지 못했습니다."
    [ "$FORMAT_STATUS" -ne 0 ] && echo "- Prettier 포맷 중 오류가 발생했습니다 (문법 오류일 수 있음)."
    [ "$LINT_STATUS" -ne 0 ] && echo "- ESLint가 자동으로 고칠 수 없는 문제를 발견했습니다."
    echo ""
    echo "$LINT_LOG"
  } >&2
  exit 2
fi

exit 0
