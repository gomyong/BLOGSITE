import fs from "fs";
import path from "path";

/**
 * 콘텐츠 저장소 — 발행/수정/삭제를 GitHub 저장소 커밋으로 처리한다.
 * 커밋되면 Vercel이 자동 재빌드하므로 별도 DB 없이 CMS가 동작한다.
 *
 * 필요 환경변수:
 *  - GITHUB_TOKEN  : repo contents 쓰기 권한이 있는 fine-grained PAT
 *  - GITHUB_REPO   : "owner/repo" (예: gomyong/BLOGSITE)
 *  - GITHUB_BRANCH : 커밋 대상 브랜치 (기본 main)
 *
 * GITHUB_TOKEN이 없으면 로컬 파일시스템에 직접 쓴다(개발 모드).
 */

const API = "https://api.github.com";

function ghConfig() {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH ?? "main";
  if (!token || !repo) return null;
  return { token, repo, branch };
}

export function storageMode(): "github" | "local" {
  return ghConfig() ? "github" : "local";
}

async function ghRequest(
  method: string,
  apiPath: string,
  body?: Record<string, unknown>
) {
  const cfg = ghConfig();
  if (!cfg) throw new Error("GitHub 저장소가 설정되지 않았습니다.");
  const res = await fetch(`${API}/repos/${cfg.repo}${apiPath}`, {
    method,
    headers: {
      Authorization: `Bearer ${cfg.token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
  if (!res.ok && res.status !== 404) {
    const detail = await res.text().catch(() => "");
    throw new Error(`GitHub API ${res.status}: ${detail.slice(0, 200)}`);
  }
  return res;
}

/** 파일의 현재 blob SHA 조회 (없으면 null) */
async function ghGetSha(filePath: string): Promise<string | null> {
  const cfg = ghConfig()!;
  const res = await ghRequest(
    "GET",
    `/contents/${encodeURIComponent(filePath).replace(/%2F/g, "/")}?ref=${cfg.branch}`
  );
  if (res.status === 404) return null;
  const json = await res.json();
  return json.sha ?? null;
}

/** 디렉터리의 파일 목록 */
export async function listFiles(dir: string): Promise<string[]> {
  if (storageMode() === "local") {
    const full = path.join(process.cwd(), dir);
    if (!fs.existsSync(full)) return [];
    return fs.readdirSync(full).filter((f) => f.endsWith(".mdx"));
  }
  const cfg = ghConfig()!;
  const res = await ghRequest("GET", `/contents/${dir}?ref=${cfg.branch}`);
  if (res.status === 404) return [];
  const json = await res.json();
  if (!Array.isArray(json)) return [];
  return json
    .filter((f: { type: string; name: string }) => f.type === "file" && f.name.endsWith(".mdx"))
    .map((f: { name: string }) => f.name);
}

/** 파일 내용 읽기 (UTF-8 텍스트, 없으면 null) */
export async function readFile(filePath: string): Promise<string | null> {
  if (storageMode() === "local") {
    const full = path.join(process.cwd(), filePath);
    if (!fs.existsSync(full)) return null;
    return fs.readFileSync(full, "utf-8");
  }
  const cfg = ghConfig()!;
  const res = await ghRequest("GET", `/contents/${filePath}?ref=${cfg.branch}`);
  if (res.status === 404) return null;
  const json = await res.json();
  return Buffer.from(json.content, "base64").toString("utf-8");
}

/** 파일 쓰기(생성/수정) — GitHub 모드에서는 커밋 하나가 만들어진다 */
export async function writeFile(
  filePath: string,
  content: string | Buffer,
  message: string
): Promise<void> {
  if (storageMode() === "local") {
    const full = path.join(process.cwd(), filePath);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, content);
    return;
  }
  const cfg = ghConfig()!;
  const sha = await ghGetSha(filePath);
  await ghRequest("PUT", `/contents/${filePath}`, {
    message,
    content: Buffer.from(content).toString("base64"),
    branch: cfg.branch,
    ...(sha ? { sha } : {}),
  });
}

/** 파일 삭제 */
export async function deleteFile(
  filePath: string,
  message: string
): Promise<void> {
  if (storageMode() === "local") {
    const full = path.join(process.cwd(), filePath);
    if (fs.existsSync(full)) fs.unlinkSync(full);
    return;
  }
  const cfg = ghConfig()!;
  const sha = await ghGetSha(filePath);
  if (!sha) return;
  await ghRequest("DELETE", `/contents/${filePath}`, {
    message,
    sha,
    branch: cfg.branch,
  });
}
