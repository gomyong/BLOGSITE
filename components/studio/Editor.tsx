"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  ImagePlus,
  Loader2,
  Settings2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import RichEditor from "./RichEditor";

type PostType = "insight" | "brief";

interface EditorProps {
  type: PostType;
  slug?: string; // 있으면 수정 모드
}

function defaultSlug(type: PostType) {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const stamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}`;
  return type === "insight" ? `post-${stamp}` : `brief-${stamp}`;
}

function todayISO() {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

function nowISOWithTime() {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${todayISO()}T${pad(now.getHours())}:${pad(now.getMinutes())}:00+09:00`;
}

export default function Editor({ type, slug: initialSlug }: EditorProps) {
  const router = useRouter();
  const isEdit = Boolean(initialSlug);
  const fileInput = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState<false | "draft" | "publish">(false);
  const [message, setMessage] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [uploading, setUploading] = useState(false);

  // 공통 필드
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [slug, setSlug] = useState(initialSlug ?? defaultSlug(type));
  const [tags, setTags] = useState("");
  // 인사이트 전용
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Tech");
  const [coverImage, setCoverImage] = useState("");
  const [featured, setFeatured] = useState(false);
  const [author, setAuthor] = useState("에디터");
  const [date, setDate] = useState(todayISO());
  // 브리프 전용
  const [link, setLink] = useState("");

  // 수정 모드 — 기존 글 로딩
  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      const res = await fetch(`/api/admin/posts/${type}/${initialSlug}`);
      if (res.ok) {
        const { frontmatter: fm, content: body } = await res.json();
        setTitle(fm.title ?? "");
        setContent(body ?? "");
        setDescription(fm.description ?? "");
        setCategory(fm.category ?? "Tech");
        setCoverImage(fm.coverImage ?? "");
        setFeatured(Boolean(fm.featured));
        setAuthor(fm.author ?? "에디터");
        setTags((fm.tags ?? []).join(", "));
        setLink(fm.link ?? "");
        if (fm.date) setDate(String(fm.date).slice(0, 10));
      } else {
        setMessage("글을 불러오지 못했습니다.");
      }
      setLoading(false);
    })();
  }, [isEdit, initialSlug, type]);

  /** 파일을 업로드하고 저장된 경로를 반환한다 (RichEditor / 커버 공용) */
  async function uploadImage(file: File): Promise<string | null> {
    setUploading(true);
    try {
      const data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () =>
          resolve((reader.result as string).split(",")[1] ?? "");
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: file.name, data }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      return json.path as string;
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "업로드 실패");
      return null;
    } finally {
      setUploading(false);
    }
  }

  async function handleCoverSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const path = await uploadImage(file);
    if (path) setCoverImage(path);
    e.target.value = "";
  }

  async function save(asDraft: boolean) {
    if (type === "insight" && !title.trim()) {
      setMessage("제목을 입력하세요.");
      return;
    }
    if (!content.trim()) {
      setMessage("본문을 입력하세요.");
      return;
    }
    setSaving(asDraft ? "draft" : "publish");
    setMessage("");

    const frontmatter =
      type === "insight"
        ? {
            title: title.trim(),
            description: description.trim(),
            date,
            category,
            tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
            coverImage,
            featured,
            author,
            ...(asDraft ? { draft: true } : {}),
          }
        : {
            date: isEdit ? `${date}T12:00:00+09:00` : nowISOWithTime(),
            tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
            ...(link.trim() ? { link: link.trim() } : {}),
            ...(asDraft ? { draft: true } : {}),
          };

    const res = await fetch("/api/admin/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        slug,
        frontmatter,
        content,
        previousSlug: isEdit ? initialSlug : undefined,
      }),
    });
    const json = await res.json().catch(() => ({}));
    if (res.ok) {
      router.push("/studio?published=1");
    } else {
      setMessage(json.error ?? "저장에 실패했습니다.");
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-xl">
        <Loader2 size={20} className="animate-spin text-on-surface-variant" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-content-max px-[20px] pb-section md:px-lg">
      {/* 액션 바 (목록 / 설정 / 저장 / 발행) */}
      <div className="sticky top-14 z-30 -mx-[20px] flex h-12 items-center gap-xs border-b border-outline-variant bg-surface/95 px-[20px] backdrop-blur-md md:-mx-lg md:px-lg">
        <button
          type="button"
          onClick={() => router.push("/studio")}
          className="flex items-center gap-1 font-label text-label-sm text-on-surface-variant transition-colors hover:text-primary"
        >
          <ArrowLeft size={13} /> 목록
        </button>
        <span className="font-label text-label-sm uppercase text-outline">
          {type === "insight" ? "Article" : "Brief"}
          {isEdit ? " · 수정" : ""}
        </span>
        <div className="ml-auto flex items-center gap-xs">
          <button
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            className={cn(
              "flex items-center gap-1 px-xs py-[5px] font-label text-label-sm transition-colors",
              showSettings
                ? "bg-on-surface text-surface"
                : "text-on-surface-variant hover:text-primary"
            )}
          >
            <Settings2 size={13} /> 설정
          </button>
          <button
            type="button"
            onClick={() => save(true)}
            disabled={Boolean(saving)}
            className="border border-outline-variant px-sm py-[5px] font-label text-label-sm text-on-surface-variant transition-colors hover:border-primary hover:text-primary disabled:opacity-50"
          >
            {saving === "draft" ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              "초안 저장"
            )}
          </button>
          <button
            type="button"
            onClick={() => save(false)}
            disabled={Boolean(saving)}
            className="flex items-center gap-1 bg-primary-container px-sm py-[5px] font-label text-label-sm text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {saving === "publish" ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <>
                <Check size={13} /> 발행
              </>
            )}
          </button>
        </div>
      </div>

      {message && (
        <p className="mt-sm border border-error/40 bg-error/5 px-sm py-xs text-sm text-error">
          {message}
        </p>
      )}

      {/* 설정 패널 */}
      {showSettings && (
        <div className="mt-md space-y-sm border border-outline-variant bg-surface-container-lowest p-md">
          <div className="grid grid-cols-1 gap-sm sm:grid-cols-2">
            <label className="block">
              <span className="font-label text-label-sm uppercase text-on-surface-variant">
                슬러그 (URL)
              </span>
              <input
                value={slug}
                onChange={(e) =>
                  setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))
                }
                className="mt-1 w-full border border-outline-variant bg-surface px-xs py-[6px] font-code text-[13px] focus:border-primary focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="font-label text-label-sm uppercase text-on-surface-variant">
                태그 (쉼표로 구분)
              </span>
              <input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="AI, Brand, UX"
                className="mt-1 w-full border border-outline-variant bg-surface px-xs py-[6px] text-body-md focus:border-primary focus:outline-none"
              />
            </label>
            {type === "insight" ? (
              <>
                <label className="block">
                  <span className="font-label text-label-sm uppercase text-on-surface-variant">
                    카테고리
                  </span>
                  <input
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-1 w-full border border-outline-variant bg-surface px-xs py-[6px] text-body-md focus:border-primary focus:outline-none"
                  />
                </label>
                <label className="block">
                  <span className="font-label text-label-sm uppercase text-on-surface-variant">
                    발행일
                  </span>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="mt-1 w-full border border-outline-variant bg-surface px-xs py-[6px] text-body-md focus:border-primary focus:outline-none"
                  />
                </label>
                <label className="block sm:col-span-2">
                  <span className="font-label text-label-sm uppercase text-on-surface-variant">
                    요약 (SEO 설명)
                  </span>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                    className="mt-1 w-full resize-none border border-outline-variant bg-surface px-xs py-[6px] text-body-md focus:border-primary focus:outline-none"
                  />
                </label>
                <label className="block">
                  <span className="font-label text-label-sm uppercase text-on-surface-variant">
                    글쓴이
                  </span>
                  <input
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="mt-1 w-full border border-outline-variant bg-surface px-xs py-[6px] text-body-md focus:border-primary focus:outline-none"
                  />
                </label>
                <label className="flex items-end gap-xs pb-[6px]">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="h-4 w-4 accent-[#0d9488]"
                  />
                  <span className="text-body-md text-on-surface">
                    메인 대표글(Featured)로 노출
                  </span>
                </label>
              </>
            ) : (
              <label className="block sm:col-span-2">
                <span className="font-label text-label-sm uppercase text-on-surface-variant">
                  원문 링크 (선택)
                </span>
                <input
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="https://..."
                  className="mt-1 w-full border border-outline-variant bg-surface px-xs py-[6px] text-body-md focus:border-primary focus:outline-none"
                />
              </label>
            )}
          </div>
        </div>
      )}

      {/* 커버 이미지 (인사이트 전용) */}
      {type === "insight" && (
        <div className="mt-lg">
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            onChange={handleCoverSelect}
            className="hidden"
          />
          {coverImage ? (
            <div className="group relative aspect-[21/9] w-full overflow-hidden border border-outline-variant">
              <Image
                src={coverImage}
                alt="커버 이미지"
                fill
                sizes="720px"
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => setCoverImage("")}
                className="absolute right-xs top-xs flex items-center gap-1 bg-on-surface/80 px-xs py-[4px] font-label text-[11px] text-surface opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X size={11} /> 제거
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              disabled={uploading}
              className="flex w-full items-center justify-center gap-xs border border-dashed border-outline-variant py-md font-label text-label-sm text-on-surface-variant transition-colors hover:border-primary hover:text-primary disabled:opacity-50"
            >
              {uploading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <ImagePlus size={14} />
              )}
              커버 이미지 추가
            </button>
          )}
        </div>
      )}

      {/* 제목 (인사이트 전용) */}
      {type === "insight" && (
        <div className="mt-lg">
          <textarea
            value={title}
            onChange={(e) => setTitle(e.target.value.replace(/\n/g, ""))}
            placeholder="제목을 입력하세요"
            rows={1}
            className="w-full resize-none border-none bg-transparent font-headline text-2xl font-extrabold leading-tight tracking-tight text-on-surface outline-none placeholder:text-outline-variant sm:text-display"
            onInput={(e) => {
              const el = e.currentTarget;
              el.style.height = "auto";
              el.style.height = `${el.scrollHeight}px`;
            }}
          />
        </div>
      )}

      {/* 본문 — 인사이트는 리치 에디터, 브리프는 간단 텍스트 */}
      {type === "insight" ? (
        <div className="mt-md">
          <RichEditor
            value={content}
            onChange={setContent}
            uploadImage={uploadImage}
            placeholder="이야기를 시작하세요…  상단 도구모음으로 제목·굵게·인용·이미지 등을 넣을 수 있어요."
          />
        </div>
      ) : (
        <div className="mt-lg">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="짧은 단신을 입력하세요. 제목 없이 본문만 쓰면 됩니다."
            className="min-h-[40vh] w-full resize-none border-none bg-transparent text-[15px] leading-[1.9] text-on-surface outline-none placeholder:text-outline-variant"
            onInput={(e) => {
              const el = e.currentTarget;
              el.style.height = "auto";
              el.style.height = `${el.scrollHeight}px`;
            }}
          />
        </div>
      )}
    </div>
  );
}
