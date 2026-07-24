#!/usr/bin/env node
/**
 * Auto-Brief 파이프라인
 *  RSS 공식 피드 수집 → Gemini 요약 → content/briefs/*.mdx 발행
 *
 * 실행: (automation/ 디렉터리에서) node generate-briefs.mjs
 *
 * 환경변수
 *   GEMINI_API_KEY        (필수) Google AI Studio 발급 키
 *   GEMINI_MODEL          (선택) 기본 "gemini-2.5-flash"
 *   AUTO_BRIEF_MODE       (선택) "draft" | "publish"  기본 "draft"
 *                          - draft:   전부 초안으로 발행 (승인 모드)
 *                          - publish: sources.yml의 auto_publish=true 소스만 즉시 발행
 *   CONFIDENCE_THRESHOLD  (선택) 기본 0.7 (미만이면 스킵)
 *   DRY_RUN               (선택) "1"이면 파일을 쓰지 않고 로그만 출력
 */

import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";
import yaml from "js-yaml";
import Parser from "rss-parser";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const BRIEFS_DIR = path.join(REPO_ROOT, "content", "briefs");
const SOURCES_FILE = path.join(__dirname, "sources.yml");
const SEEN_FILE = path.join(__dirname, "briefs-seen.json");

const MODE = process.env.AUTO_BRIEF_MODE === "publish" ? "publish" : "draft";
const DRY_RUN = process.env.DRY_RUN === "1";
// "gemini-flash-latest" 별칭 — 항상 현행 flash 모델을 가리켜 특정 버전이 폐기돼도
// 끊기지 않는다. (고정 버전을 쓰려면 GEMINI_MODEL 변수로 덮어쓴다.)
const MODEL = process.env.GEMINI_MODEL || "gemini-flash-latest";
const CONFIDENCE_THRESHOLD = Number(process.env.CONFIDENCE_THRESHOLD || "0.7");
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY && !DRY_RUN) {
  console.error("✗ GEMINI_API_KEY 환경변수가 없습니다.");
  process.exit(1);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** URL 정규화 — 쿼리/프래그먼트/트레일링 슬래시 제거 후 해시 */
function urlKey(url) {
  try {
    const u = new URL(url);
    u.search = "";
    u.hash = "";
    let s = `${u.host}${u.pathname}`.toLowerCase().replace(/\/$/, "");
    return crypto.createHash("sha1").update(s).digest("hex").slice(0, 16);
  } catch {
    return crypto.createHash("sha1").update(String(url)).digest("hex").slice(0, 16);
  }
}

function slugify(s) {
  return String(s)
    .toLowerCase()
    .replace(/https?:\/\//, "")
    .replace(/[^a-z0-9가-힣]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

function kstDateParts(d = new Date()) {
  const kst = new Date(d.getTime() + 9 * 3600 * 1000);
  const pad = (n) => String(n).padStart(2, "0");
  return {
    date: `${kst.getUTCFullYear()}-${pad(kst.getUTCMonth() + 1)}-${pad(kst.getUTCDate())}`,
    iso: `${kst.getUTCFullYear()}-${pad(kst.getUTCMonth() + 1)}-${pad(kst.getUTCDate())}T${pad(kst.getUTCHours())}:${pad(kst.getUTCMinutes())}:00+09:00`,
  };
}

/** Gemini 요약 호출 → { summary, tags, confidence } */
async function summarize({ title, snippet, sourceName, lang }) {
  const prompt = `당신은 테크·브랜드·비즈니스 단신을 쓰는 한국어 에디터입니다.
아래 기사 정보를 바탕으로 짧은 단신(brief)을 작성하세요.

# 규칙
- 2~4문장, 한국어. 사실 전달 + 마지막에 한 줄 시사점.
- 모든 문장을 반드시 '-합니다 / -습니다' 체(합쇼체)로 끝맺을 것. '-다', '-이다' 같은 평서체 금지.
- 원문 문장을 그대로 번역·전재하지 말 것. 반드시 재구성해서 요약할 것.
- 과장/추측 금지. 제공된 정보에 없는 사실을 지어내지 말 것.
- 아래 예시의 담백한 톤을 따를 것.
- 논문(Paper)인 경우, 핵심 기여와 결과를 중심으로 쉽게 풀어서 요약할 것.
- 정보가 부실해 신뢰할 수 있는 요약이 어려우면 confidence를 낮게(0.5 미만) 매길 것.
- 요약/발췌가 뉴스 기사가 아니라 AI 모델·데이터셋의 메타데이터(태스크, 다운로드 수,
  태그 등)인 경우, 그 정보만 근거로 "어떤 모델/데이터셋이고 왜 주목할 만한지"를
  소개하는 톤으로 작성할 것. 메타데이터에 없는 성능·벤치마크 수치는 지어내지 말 것.
- tags는 1~3개, 영문 또는 한국어 짧은 키워드.

# 톤 예시 (문체는 이렇게 '-합니다'로 통일)
"OpenAI가 첫 컨슈머 하드웨어의 양산 파트너를 확정했다는 보도입니다. 스마트폰이 아닌 '스크린 없는 웨어러블' 폼팩터가 유력합니다. 조니 아이브 팀 합류 이후 2년 만의 결과물이 연내 공개될 전망입니다."

# 기사 정보
- 매체: ${sourceName}
- 원문 언어: ${lang}
- 제목: ${title}
- 요약/발췌: ${snippet || "(피드에 요약 없음 — 제목 기반으로 신중히 작성)"}

JSON 형식으로만 답하세요: { "summary": string, "tags": string[], "confidence": number(0~1) }`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.4,
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: {
          summary: { type: "STRING" },
          tags: { type: "ARRAY", items: { type: "STRING" } },
          confidence: { type: "NUMBER" },
        },
        required: ["summary", "tags", "confidence"],
      },
    },
  };

  // 요청 실행 — 429(rate limit)면 백오프 후 재시도.
  let res;
  for (let attempt = 0; ; attempt++) {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.status !== 429 || attempt >= 2) break;
    const waitMs = 20000 * (attempt + 1); // 20s, 40s
    console.warn(`  … Gemini 429(rate limit) — ${waitMs / 1000}초 대기 후 재시도`);
    await sleep(waitMs);
  }
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Gemini ${res.status}: ${detail.slice(0, 200)}`);
  }
  const json = await res.json();
  const text = json?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini 응답이 비어 있습니다.");
  return JSON.parse(text);
}

/** 요약 결과 품질 게이트 */
function validate(result) {
  if (!result || typeof result.summary !== "string") return "요약 형식 오류";
  const len = result.summary.trim().length;
  if (len < 60) return `요약이 너무 짧음(${len}자)`;
  if (len > 320) return `요약이 너무 김(${len}자)`;
  if (typeof result.confidence !== "number" || result.confidence < CONFIDENCE_THRESHOLD)
    return `신뢰도 미달(${result.confidence})`;
  return null;
}

function writeBrief({ iso, dateStr, slug, tags, link, source, summary, draft }) {
  const fmTags = `[${tags.map((t) => JSON.stringify(t)).join(", ")}]`;
  const lines = [
    "---",
    `date: "${iso}"`,
    `tags: ${fmTags}`,
    `link: "${link}"`,
    `source: "${source}"`,
    "automated: true",
  ];
  if (draft) lines.push("draft: true");
  lines.push("---", "", summary.trim(), "");
  const mdx = lines.join("\n");
  const file = path.join(BRIEFS_DIR, `${dateStr}-${slug}.mdx`);
  if (DRY_RUN) {
    console.log(`  [dry-run] would write ${path.relative(REPO_ROOT, file)}`);
    console.log(mdx.replace(/^/gm, "    | "));
    return;
  }
  fs.mkdirSync(BRIEFS_DIR, { recursive: true });
  fs.writeFileSync(file, mdx);
  console.log(`  ✓ wrote ${path.relative(REPO_ROOT, file)}${draft ? " (draft)" : ""}`);
}

/**
 * Hugging Face Hub 공식 API에서 모델/데이터셋 목록을 가져와 RSS 아이템과 같은
 * 형태({ title, link, snippet, pubDate })로 변환한다. (RSS 아님, 공식 문서화 API —
 * docs/PRD-brief-automation.md 7장 참조)
 */
async function fetchHuggingFaceItems(src) {
  const res = await fetch(src.api, {
    headers: {
      Accept: "application/json",
      "User-Agent": "blogsite-auto-brief/1.0 (+https://github.com/gomyong/BLOGSITE)",
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const list = await res.json();
  const base = src.kind === "dataset" ? "https://huggingface.co/datasets" : "https://huggingface.co";

  return (Array.isArray(list) ? list : [])
    .map((m) => {
      const id = m.id || m.modelId;
      if (!id) return null;
      const facts = [];
      if (m.pipeline_tag) facts.push(`태스크: ${m.pipeline_tag}`);
      if (m.library_name) facts.push(`라이브러리: ${m.library_name}`);
      if (typeof m.downloads === "number") facts.push(`다운로드: ${m.downloads.toLocaleString()}`);
      if (typeof m.likes === "number") facts.push(`좋아요: ${m.likes}`);
      if (Array.isArray(m.tags) && m.tags.length) facts.push(`태그: ${m.tags.slice(0, 8).join(", ")}`);
      return {
        title: id,
        link: `${base}/${id}`,
        snippet: facts.join(" · "),
        // trending 정렬은 최신성과 무관하므로 pubDate를 비워 기간 필터(max_age_hours)를 건너뛴다.
        pubDate: src.newest ? m.createdAt || m.lastModified || null : null,
      };
    })
    .filter(Boolean);
}

async function main() {
  const cfg = yaml.load(fs.readFileSync(SOURCES_FILE, "utf-8"));
  const filters = cfg.filters || {};
  const includeKw = (filters.include_keywords || []).map((k) => k.toLowerCase());
  const maxPerRun = filters.max_items_per_run ?? 3;
  const maxPerSource = filters.max_items_per_source ?? 1;
  const maxAgeMs = (filters.max_age_hours ?? 24) * 3600 * 1000;

  const seenData = JSON.parse(fs.readFileSync(SEEN_FILE, "utf-8"));
  const seen = new Set(seenData.seen.map((s) => s.k));

  const parser = new Parser({ timeout: 15000 });
  const now = Date.now();
  const candidates = [];
  const pickedThisRun = new Set(); // 같은 실행 내 소스 간(예: 트렌딩/신규) 중복 방지

  for (const src of cfg.sources || []) {
    let picked = 0;
    let items;
    try {
      if (src.type === "huggingface") {
        items = await fetchHuggingFaceItems(src);
      } else {
        const feed = await parser.parseURL(src.feed);
        items = (feed.items || []).map((item) => ({
          title: item.title || "",
          link: item.link,
          snippet: (item.contentSnippet || item.content || "").replace(/\s+/g, " ").slice(0, 600),
          pubDate: item.isoDate || item.pubDate,
        }));
      }
    } catch (e) {
      console.warn(`⚠ 소스 실패 [${src.name}]: ${e.message}`);
      continue;
    }
    for (const item of items) {
      if (picked >= maxPerSource) break;
      const link = item.link;
      if (!link) continue;
      const k = urlKey(link);
      if (seen.has(k) || pickedThisRun.has(k)) continue;

      if (item.pubDate && now - new Date(item.pubDate).getTime() > maxAgeMs) continue;

      const hay = `${item.title} ${item.snippet}`.toLowerCase();
      if (includeKw.length && !includeKw.some((kw) => hay.includes(kw))) continue;

      candidates.push({
        k,
        link,
        title: item.title,
        snippet: item.snippet.slice(0, 600),
        source: src,
      });
      pickedThisRun.add(k);
      picked++;
    }
  }

  console.log(`수집 후보: ${candidates.length}건 (모드: ${MODE}${DRY_RUN ? ", dry-run" : ""})`);
  const toProcess = candidates.slice(0, maxPerRun);
  const newlySeen = [];
  let published = 0;

  let consecutiveFail = 0; // 연속 요약 실패 횟수 (할당량/모델 오류 등)
  for (let i = 0; i < toProcess.length; i++) {
    const c = toProcess[i];
    // 분당 요청 한도(rate limit)를 넘지 않도록 요청 사이에 간격을 둔다.
    if (i > 0 && API_KEY) await sleep(4000);
    console.log(`\n· [${c.source.name}] ${c.title}`);
    let result;
    try {
      result =
        API_KEY == null
          ? { summary: c.snippet.slice(0, 200), tags: [], confidence: 1 } // dry-run without key
          : await summarize({
              title: c.title,
              snippet: c.snippet,
              sourceName: c.source.name,
              lang: c.source.lang || "ko",
            });
      consecutiveFail = 0;
    } catch (e) {
      console.warn(`  ⚠ 요약 실패: ${e.message} → 스킵 (다음 실행에서 재시도)`);
      // 크레딧 소진·모델 오류 등 시스템 문제면 남은 후보도 전부 실패하므로 조기 종료.
      if (++consecutiveFail >= 3) {
        console.warn("⚠ 연속 3회 요약 실패 — 이번 실행 조기 종료");
        break;
      }
      continue; // seen에 넣지 않음 → 다음 실행 재시도
    }

    const bad = validate(result);
    if (bad) {
      console.warn(`  ⚠ 품질 미달: ${bad} → 스킵 (재시도 안 함)`);
      newlySeen.push({ k: c.k, at: new Date().toISOString() }); // 재시도 방지
      continue;
    }

    const tags = Array.from(
      new Set([...(c.source.tags || []), ...(result.tags || [])])
    ).slice(0, 3);
    const draft = !(MODE === "publish" && c.source.auto_publish === true);
    const { date: dateStr, iso } = kstDateParts();

    writeBrief({
      iso,
      dateStr,
      slug: `${slugify(c.source.name)}-${c.k.slice(0, 8)}`,
      tags,
      link: c.link,
      source: c.source.name,
      summary: result.summary,
      draft,
    });
    newlySeen.push({ k: c.k, at: new Date().toISOString() });
    published++;
  }

  // seen 갱신 — 최근 60일치만 유지
  if (!DRY_RUN && newlySeen.length) {
    const cutoff = Date.now() - 60 * 24 * 3600 * 1000;
    const merged = [...seenData.seen, ...newlySeen].filter(
      (s) => new Date(s.at).getTime() > cutoff
    );
    fs.writeFileSync(
      SEEN_FILE,
      JSON.stringify({ version: 1, seen: merged }, null, 2) + "\n"
    );
  }

  console.log(`\n완료: ${published}건 발행${DRY_RUN ? " (dry-run)" : ""}.`);
  // 발행 건수를 GitHub Actions 출력으로 노출
  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `published=${published}\n`);
  }
}

main().catch((e) => {
  console.error("✗ 파이프라인 오류:", e);
  process.exit(1);
});
