"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  FileText,
  Loader2,
  LogOut,
  MessageSquareText,
  Pencil,
  Plus,
  Send,
  Trash2,
} from "lucide-react";
import { formatDate, cn } from "@/lib/utils";

interface PostItem {
  type: "insight" | "brief";
  slug: string;
  title: string;
  date: string;
  category: string;
  draft: boolean;
  featured: boolean;
  content?: string; // 브리프만 포함 (전체 내용을 목록에서 바로 보여주기 위함)
}

function keyOf(post: Pick<PostItem, "type" | "slug">) {
  return `${post.type}-${post.slug}`;
}

export default function Dashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [insights, setInsights] = useState<PostItem[]>([]);
  const [briefs, setBriefs] = useState<PostItem[]>([]);
  const [storage, setStorage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [justPublished, setJustPublished] = useState(false);

  // 발행 직후 리다이렉트(?published=1)되면 배너를 보여주고 URL을 정리한다.
  // 이 사이트는 완전 정적(SSG)이라 지금 이 순간 저장은 끝났어도, GitHub 커밋을
  // Vercel이 다시 빌드해 배포해야 실제 사이트에 반영된다 — 그 지연을 명확히 알려준다.
  useEffect(() => {
    if (searchParams.get("published") === "1") {
      setJustPublished(true);
      router.replace("/studio");
    }
  }, [searchParams, router]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/posts", { cache: "no-store" });
      if (!res.ok) throw new Error(`목록을 불러오지 못했습니다 (${res.status})`);
      const json = await res.json();
      const byDate = (a: PostItem, b: PostItem) => (a.date < b.date ? 1 : -1);
      setInsights((json.insights as PostItem[]).sort(byDate));
      setBriefs((json.briefs as PostItem[]).sort(byDate));
      setStorage(json.storage);
    } catch (e) {
      setError(e instanceof Error ? e.message : "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function toggleOne(post: PostItem) {
    setSelected((prev) => {
      const next = new Set(prev);
      const k = keyOf(post);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });
  }

  function toggleAll(items: PostItem[]) {
    setSelected((prev) => {
      const next = new Set(prev);
      const allSelected = items.length > 0 && items.every((i) => next.has(keyOf(i)));
      for (const i of items) {
        if (allSelected) next.delete(keyOf(i));
        else next.add(keyOf(i));
      }
      return next;
    });
  }

  function deselect(items: PostItem[]) {
    setSelected((prev) => {
      const next = new Set(prev);
      items.forEach((i) => next.delete(keyOf(i)));
      return next;
    });
  }

  async function handleDelete(post: PostItem) {
    if (!confirm(`"${post.title}" 글을 삭제할까요? 되돌릴 수 없습니다.`)) return;
    const res = await fetch(`/api/admin/posts/${post.type}/${post.slug}`, {
      method: "DELETE",
    });
    if (res.ok) load();
    else alert("삭제에 실패했습니다.");
  }

  async function handlePublish(post: PostItem) {
    if (!confirm(`"${post.title}" 초안을 발행할까요?`)) return;
    const res = await fetch(`/api/admin/posts/${post.type}/${post.slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "publish" }),
    });
    if (res.ok) load();
    else alert("발행에 실패했습니다.");
  }

  /**
   * 여러 글을 동시에(Promise.allSettled 등으로) 삭제/발행하면 GitHub Contents API가
   * 같은 브랜치에 동시에 여러 커밋을 만들려다 ref 갱신 경합으로 일부 요청을
   * 거부한다(Auto-Brief 파이프라인에서 겪었던 "push 거부"와 같은 종류의 문제,
   * 커밋 9031e24 참조). 그래서 한 번에 하나씩 순차 처리한다.
   */
  async function runSequentially(
    targets: PostItem[],
    request: (post: PostItem) => Promise<Response>
  ) {
    const failures: string[] = [];
    for (const post of targets) {
      try {
        const res = await request(post);
        if (!res.ok) {
          const detail = await res.json().catch(() => null);
          failures.push(`${post.title}: ${detail?.error ?? res.status}`);
        }
      } catch (e) {
        failures.push(`${post.title}: ${e instanceof Error ? e.message : "네트워크 오류"}`);
      }
    }
    return failures;
  }

  async function handleBulkDelete(items: PostItem[]) {
    const targets = items.filter((i) => selected.has(keyOf(i)));
    if (targets.length === 0) return;
    if (!confirm(`선택한 ${targets.length}개 글을 삭제할까요? 되돌릴 수 없습니다.`)) return;
    const failures = await runSequentially(targets, (post) =>
      fetch(`/api/admin/posts/${post.type}/${post.slug}`, { method: "DELETE" })
    );
    if (failures.length > 0) {
      alert(`${failures.length}개 삭제에 실패했습니다.\n\n${failures.join("\n")}`);
    }
    deselect(targets);
    load();
  }

  async function handleBulkPublish(items: PostItem[]) {
    const targets = items.filter((i) => selected.has(keyOf(i)) && i.draft);
    if (targets.length === 0) {
      alert("선택한 항목 중 초안이 없습니다.");
      return;
    }
    if (!confirm(`선택한 초안 ${targets.length}개를 발행할까요?`)) return;
    const failures = await runSequentially(targets, (post) =>
      fetch(`/api/admin/posts/${post.type}/${post.slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "publish" }),
      })
    );
    if (failures.length > 0) {
      alert(`${failures.length}개 발행에 실패했습니다.\n\n${failures.join("\n")}`);
    }
    deselect(targets);
    load();
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  }

  function renderListHeader(items: PostItem[]) {
    const selectedItems = items.filter((i) => selected.has(keyOf(i)));
    const draftCount = selectedItems.filter((i) => i.draft).length;
    return (
      <div className="mb-xs flex flex-wrap items-center gap-sm">
        <label className="flex items-center gap-xs font-label text-label-sm text-on-surface-variant">
          <input
            type="checkbox"
            checked={items.length > 0 && items.every((i) => selected.has(keyOf(i)))}
            onChange={() => toggleAll(items)}
            disabled={items.length === 0}
            className="h-4 w-4 accent-primary"
          />
          전체 선택
        </label>
        {selectedItems.length > 0 && (
          <div className="flex flex-wrap items-center gap-sm border border-outline-variant bg-surface-container-low px-sm py-[3px]">
            <span className="font-label text-label-sm text-on-surface-variant">
              {selectedItems.length}개 선택됨
            </span>
            {draftCount > 0 && (
              <button
                type="button"
                onClick={() => handleBulkPublish(items)}
                className="flex items-center gap-[4px] font-label text-label-sm text-accent hover:underline"
              >
                <Send size={13} /> 선택 발행 ({draftCount})
              </button>
            )}
            <button
              type="button"
              onClick={() => handleBulkDelete(items)}
              className="flex items-center gap-[4px] font-label text-label-sm text-error hover:underline"
            >
              <Trash2 size={13} /> 선택 삭제
            </button>
            <button
              type="button"
              onClick={() => deselect(items)}
              className="font-label text-label-sm text-on-surface-variant hover:underline"
            >
              선택 해제
            </button>
          </div>
        )}
      </div>
    );
  }

  function renderList(items: PostItem[], emptyText: string) {
    if (items.length === 0) {
      return (
        <p className="border border-dashed border-outline-variant p-md text-center text-body-md text-on-surface-variant">
          {emptyText}
        </p>
      );
    }
    return (
      <ul className="divide-y divide-outline-variant border border-outline-variant bg-surface-container-lowest">
        {items.map((post) => {
          const k = keyOf(post);
          return (
            <li key={k} className="flex items-center gap-sm px-md py-sm">
              <input
                type="checkbox"
                checked={selected.has(k)}
                onChange={() => toggleOne(post)}
                className="h-4 w-4 shrink-0 accent-primary"
                aria-label={`${post.title} 선택`}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-xs">
                  {post.draft && (
                    <span className="bg-surface-container-highest px-xs py-[2px] font-label text-[10px] uppercase text-on-surface-variant">
                      초안
                    </span>
                  )}
                  {post.featured && (
                    <span className="chip !text-[10px]">Featured</span>
                  )}
                  <p className="truncate text-body-md font-semibold text-on-surface">
                    {post.title}
                  </p>
                </div>
                <p className="mt-[2px] font-label text-label-sm text-on-surface-variant">
                  {post.category && `${post.category} · `}
                  {post.date ? formatDate(post.date.slice(0, 10)) : "날짜 없음"}
                  {" · "}
                  {post.slug}
                </p>
              </div>
              {post.draft && (
                <button
                  type="button"
                  onClick={() => handlePublish(post)}
                  className="p-xs text-on-surface-variant transition-colors hover:text-accent"
                  title="초안 발행"
                >
                  <Send size={15} />
                </button>
              )}
              <Link
                href={`/studio/write?type=${post.type}&slug=${post.slug}`}
                className="p-xs text-on-surface-variant transition-colors hover:text-primary"
                title="수정"
              >
                <Pencil size={15} />
              </Link>
              <button
                type="button"
                onClick={() => handleDelete(post)}
                className="p-xs text-on-surface-variant transition-colors hover:text-error"
                title="삭제"
              >
                <Trash2 size={15} />
              </button>
            </li>
          );
        })}
      </ul>
    );
  }

  /** 브리프는 제목이 없는 짧은 요약이라, 목록에서 전체 내용을 바로 보여준다
   *  (edit 버튼을 눌러 들어가지 않아도 발행 여부를 판단할 수 있도록). */
  function renderBriefList(items: PostItem[], emptyText: string) {
    if (items.length === 0) {
      return (
        <p className="border border-dashed border-outline-variant p-md text-center text-body-md text-on-surface-variant">
          {emptyText}
        </p>
      );
    }
    return (
      <ul className="divide-y divide-outline-variant border border-outline-variant bg-surface-container-lowest">
        {items.map((post) => {
          const k = keyOf(post);
          return (
            <li key={k} className="flex gap-sm px-md py-sm">
              <input
                type="checkbox"
                checked={selected.has(k)}
                onChange={() => toggleOne(post)}
                className="mt-[3px] h-4 w-4 shrink-0 accent-primary"
                aria-label="브리프 선택"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-xs">
                  {post.draft && (
                    <span className="bg-surface-container-highest px-xs py-[2px] font-label text-[10px] uppercase text-on-surface-variant">
                      초안
                    </span>
                  )}
                  <p className="font-label text-label-sm text-on-surface-variant">
                    {post.date ? formatDate(post.date.slice(0, 10)) : "날짜 없음"}
                    {" · "}
                    {post.slug}
                  </p>
                </div>
                <p className="mt-xs whitespace-pre-wrap text-body-md leading-[1.7] text-on-surface">
                  {post.content || post.title}
                </p>
              </div>
              <div className="flex shrink-0 items-start gap-xs">
                {post.draft && (
                  <button
                    type="button"
                    onClick={() => handlePublish(post)}
                    className="p-xs text-on-surface-variant transition-colors hover:text-accent"
                    title="초안 발행"
                  >
                    <Send size={15} />
                  </button>
                )}
                <Link
                  href={`/studio/write?type=${post.type}&slug=${post.slug}`}
                  className="p-xs text-on-surface-variant transition-colors hover:text-primary"
                  title="수정"
                >
                  <Pencil size={15} />
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(post)}
                  className="p-xs text-on-surface-variant transition-colors hover:text-error"
                  title="삭제"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <div className="mx-auto max-w-content-max px-[20px] py-lg md:px-lg">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-headline-lg font-bold text-on-surface">
            콘텐츠 관리
          </h1>
          <p className="mt-xs font-label text-label-sm text-on-surface-variant">
            {storage === "github"
              ? "발행 시 GitHub에 커밋되고 1~2분 내 사이트에 반영됩니다."
              : storage === "local"
                ? "로컬 모드 — 파일이 이 컴퓨터에 저장됩니다. (GITHUB_TOKEN 미설정)"
                : ""}
          </p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-xs font-label text-label-sm uppercase text-on-surface-variant transition-colors hover:text-primary"
        >
          <LogOut size={13} /> 로그아웃
        </button>
      </div>

      {justPublished && (
        <div className="mt-lg flex items-start gap-sm border border-accent/40 bg-accent/10 px-md py-sm text-body-md text-on-surface">
          <CheckCircle2 size={16} className="mt-[2px] shrink-0 text-accent" />
          <span>
            저장됐습니다. {storage === "github"
              ? "GitHub에 커밋되었고, Vercel이 자동으로 재배포합니다 — 보통 1~2분 뒤 실제 사이트에 반영됩니다. 지금 바로 홈에 안 보여도 정상이니 잠시 후 새로고침해 보세요."
              : "로컬 모드라 이 서버를 재시작하기 전까지는 로컬 화면에서만 확인됩니다."}
          </span>
          <button
            type="button"
            onClick={() => setJustPublished(false)}
            className="ml-auto shrink-0 font-label text-label-sm text-on-surface-variant hover:underline"
          >
            닫기
          </button>
        </div>
      )}

      <div className="mt-lg grid grid-cols-1 gap-sm sm:grid-cols-2">
        <Link
          href="/studio/write?type=insight"
          className="group flex items-center gap-sm border border-outline-variant bg-surface-container-lowest p-md transition-colors hover:border-primary"
        >
          <span className="flex h-9 w-9 items-center justify-center bg-surface-container-low text-on-surface">
            <Plus size={18} />
          </span>
          <span>
            <span className="block text-body-md font-bold text-on-surface group-hover:text-primary">
              새 아티클
            </span>
            <span className="font-label text-label-sm text-on-surface-variant">
              긴 호흡의 심층 분석 글
            </span>
          </span>
        </Link>
        <Link
          href="/studio/write?type=brief"
          className="group flex items-center gap-sm border border-outline-variant bg-surface-container-lowest p-md transition-colors hover:border-primary"
        >
          <span className="flex h-9 w-9 items-center justify-center bg-surface-container-low text-on-surface">
            <MessageSquareText size={17} />
          </span>
          <span>
            <span className="block text-body-md font-bold text-on-surface group-hover:text-primary">
              새 브리프
            </span>
            <span className="font-label text-label-sm text-on-surface-variant">
              제목 없는 짧은 단신
            </span>
          </span>
        </Link>
      </div>

      {error && (
        <p className={cn("mt-lg text-body-md text-error")}>
          {error}{" "}
          <button type="button" onClick={load} className="underline">
            다시 시도
          </button>
        </p>
      )}

      {loading ? (
        <div className="flex justify-center py-xl">
          <Loader2 size={20} className="animate-spin text-on-surface-variant" />
        </div>
      ) : (
        <>
          <h2 className="mt-xl flex items-center gap-xs font-label text-label-sm uppercase tracking-widest text-on-surface-variant">
            <FileText size={13} /> Insights · {insights.length}
          </h2>
          <div className="mt-sm">
            {insights.length > 0 && renderListHeader(insights)}
            {renderList(insights, "아직 아티클이 없습니다. 첫 글을 작성해 보세요.")}
          </div>

          <h2 className="mt-xl flex items-center gap-xs font-label text-label-sm uppercase tracking-widest text-on-surface-variant">
            <MessageSquareText size={13} /> Briefs · {briefs.length}
          </h2>
          <div className="mt-sm">
            {briefs.length > 0 && renderListHeader(briefs)}
            {renderBriefList(briefs, "아직 브리프가 없습니다.")}
          </div>
        </>
      )}
    </div>
  );
}
