"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileText,
  Loader2,
  LogOut,
  MessageSquareText,
  Pencil,
  Plus,
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
}

export default function Dashboard() {
  const router = useRouter();
  const [insights, setInsights] = useState<PostItem[]>([]);
  const [briefs, setBriefs] = useState<PostItem[]>([]);
  const [storage, setStorage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  async function handleDelete(post: PostItem) {
    if (!confirm(`"${post.title}" 글을 삭제할까요? 되돌릴 수 없습니다.`)) return;
    const res = await fetch(`/api/admin/posts/${post.type}/${post.slug}`, {
      method: "DELETE",
    });
    if (res.ok) load();
    else alert("삭제에 실패했습니다.");
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
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
        {items.map((post) => (
          <li
            key={`${post.type}-${post.slug}`}
            className="flex items-center gap-sm px-md py-sm"
          >
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
        ))}
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

      <div className="mt-lg grid grid-cols-1 gap-sm sm:grid-cols-2">
        <Link
          href="/studio/write?type=insight"
          className="group flex items-center gap-sm border border-outline-variant bg-surface-container-lowest p-md transition-colors hover:border-primary"
        >
          <span className="flex h-9 w-9 items-center justify-center bg-[#ebf5ff] text-primary dark:bg-[rgba(0,122,255,0.16)]">
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
          <span className="flex h-9 w-9 items-center justify-center bg-[#ebf5ff] text-primary dark:bg-[rgba(0,122,255,0.16)]">
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
            {renderList(insights, "아직 아티클이 없습니다. 첫 글을 작성해 보세요.")}
          </div>

          <h2 className="mt-xl flex items-center gap-xs font-label text-label-sm uppercase tracking-widest text-on-surface-variant">
            <MessageSquareText size={13} /> Briefs · {briefs.length}
          </h2>
          <div className="mt-sm">
            {renderList(briefs, "아직 브리프가 없습니다.")}
          </div>
        </>
      )}
    </div>
  );
}
