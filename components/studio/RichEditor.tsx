"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useEditor, EditorContent, BubbleMenu, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import LinkExtension from "@tiptap/extension-link";
import ImageExtension from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import { Markdown } from "tiptap-markdown";
import {
  Bold,
  Italic,
  Strikethrough,
  Underline as UnderlineIcon,
  Quote,
  List,
  ListOrdered,
  Link2,
  ImagePlus,
  Minus,
  Code2,
  Loader2,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RichEditorProps {
  value: string;
  onChange: (markdown: string) => void;
  placeholder?: string;
  /** 파일을 업로드하고 최종 경로(URL)를 반환한다. 실패 시 null */
  uploadImage: (file: File) => Promise<string | null>;
}

/** 본문에 넣을 수 있는 글자색 프리셋 (첫 번째는 기본색으로 색 해제) */
const COLORS = [
  { label: "기본", value: "" },
  { label: "틸", value: "#14b8a6" },
  { label: "레드", value: "#e11d48" },
  { label: "앰버", value: "#d97706" },
  { label: "블루", value: "#2563eb" },
  { label: "그레이", value: "#6b7280" },
];

/** 툴바 버튼 공통 */
function TB({
  onClick,
  active,
  disabled,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded transition-colors disabled:opacity-40",
        active
          ? "bg-on-surface text-surface"
          : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
      )}
    >
      {children}
    </button>
  );
}

/** 제목/본문 단락 스타일 드롭다운 */
function BlockSelect({ editor }: { editor: Editor }) {
  const current = editor.isActive("heading", { level: 2 })
    ? "h2"
    : editor.isActive("heading", { level: 3 })
      ? "h3"
      : editor.isActive("heading", { level: 4 })
        ? "h4"
        : "p";

  const set = (v: string) => {
    const chain = editor.chain().focus();
    if (v === "p") chain.setParagraph().run();
    else chain.setHeading({ level: Number(v[1]) as 2 | 3 | 4 }).run();
  };

  const labels: Record<string, string> = {
    p: "본문",
    h2: "제목 1",
    h3: "제목 2",
    h4: "제목 3",
  };

  return (
    <div className="relative">
      <select
        value={current}
        onChange={(e) => set(e.target.value)}
        className="h-8 cursor-pointer appearance-none rounded bg-transparent pl-2 pr-6 font-label text-[13px] text-on-surface hover:bg-surface-container-low focus:outline-none"
      >
        {Object.entries(labels).map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
      <ChevronDown
        size={13}
        className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-on-surface-variant"
      />
    </div>
  );
}

/** 글자색 선택 팝오버 */
function ColorMenu({ editor }: { editor: Editor }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <TB title="글자색" onClick={() => setOpen((o) => !o)} active={open}>
        <span className="flex flex-col items-center leading-none">
          <span className="text-[13px] font-bold">A</span>
          <span className="mt-[1px] h-[3px] w-[14px] rounded-sm bg-accent" />
        </span>
      </TB>
      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-0 top-9 z-20 flex gap-1.5 rounded border border-outline-variant bg-surface p-2 shadow-lg">
            {COLORS.map((c) => (
              <button
                key={c.value || "default"}
                type="button"
                title={c.label}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  if (c.value) editor.chain().focus().setColor(c.value).run();
                  else editor.chain().focus().unsetColor().run();
                  setOpen(false);
                }}
                className="h-6 w-6 rounded-full border border-outline-variant"
                style={{ backgroundColor: c.value || "var(--on-surface)" }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function RichEditor({
  value,
  onChange,
  placeholder,
  uploadImage,
}: RichEditorProps) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  // onChange를 최신으로 유지 (editor 콜백이 stale 참조를 잡지 않도록)
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
        // 코드블록/인용/리스트는 StarterKit 기본 포함
      }),
      Underline,
      TextStyle,
      Color,
      LinkExtension.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      }),
      ImageExtension.configure({ inline: false }),
      Placeholder.configure({
        placeholder: placeholder ?? "이야기를 시작하세요…",
      }),
      Markdown.configure({
        html: true, // 밑줄/글자색 등 마크다운에 없는 서식을 인라인 HTML로 보존
        transformPastedText: true,
        linkify: true,
        breaks: true,
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: "prose max-w-none min-h-[50vh] focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      const md = editor.storage.markdown.getMarkdown();
      onChangeRef.current(md);
    },
  });

  // 외부에서 value가 바뀌면(예: 수정 모드 로딩) 에디터 내용 동기화
  useEffect(() => {
    if (!editor) return;
    const currentMd = editor.storage.markdown.getMarkdown();
    if (value !== currentMd) {
      editor.commands.setContent(value);
    }
    // value/editor 준비 시 1회성 동기화 — currentMd는 의존성에서 제외
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, value]);

  const handleImagePick = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = "";
      if (!file || !editor) return;
      setUploading(true);
      const path = await uploadImage(file);
      setUploading(false);
      if (path) {
        editor.chain().focus().setImage({ src: path, alt: "" }).run();
      }
    },
    [editor, uploadImage]
  );

  const setLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("링크 URL", prev ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url })
      .run();
  }, [editor]);

  if (!editor) return null;

  return (
    <div>
      <input
        ref={fileInput}
        type="file"
        accept="image/*"
        onChange={handleImagePick}
        className="hidden"
      />

      {/* 고정 툴바 (브런치 스타일) */}
      <div className="sticky top-[104px] z-20 -mx-[20px] mb-md flex flex-wrap items-center gap-0.5 border-b border-outline-variant bg-surface/95 px-[20px] py-1.5 backdrop-blur-md md:-mx-lg md:px-lg">
        <BlockSelect editor={editor} />
        <span className="mx-1 h-5 w-px bg-outline-variant" />
        <TB
          title="굵게"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold size={15} />
        </TB>
        <TB
          title="기울임"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic size={15} />
        </TB>
        <TB
          title="밑줄"
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon size={15} />
        </TB>
        <TB
          title="취소선"
          active={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough size={15} />
        </TB>
        <ColorMenu editor={editor} />
        <span className="mx-1 h-5 w-px bg-outline-variant" />
        <TB
          title="인용"
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote size={15} />
        </TB>
        <TB
          title="글머리 목록"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List size={15} />
        </TB>
        <TB
          title="번호 목록"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered size={15} />
        </TB>
        <TB
          title="코드 블록"
          active={editor.isActive("codeBlock")}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          <Code2 size={15} />
        </TB>
        <span className="mx-1 h-5 w-px bg-outline-variant" />
        <TB title="링크" active={editor.isActive("link")} onClick={setLink}>
          <Link2 size={15} />
        </TB>
        <TB
          title="이미지"
          disabled={uploading}
          onClick={() => fileInput.current?.click()}
        >
          {uploading ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <ImagePlus size={15} />
          )}
        </TB>
        <TB
          title="구분선"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <Minus size={15} />
        </TB>
      </div>

      {/* 선택 시 떠오르는 버블 메뉴 (Medium/브런치 스타일) */}
      <BubbleMenu
        editor={editor}
        tippyOptions={{ duration: 120 }}
        className="flex items-center gap-0.5 rounded-lg border border-outline-variant bg-surface px-1 py-1 shadow-lg"
      >
        <TB
          title="굵게"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold size={14} />
        </TB>
        <TB
          title="기울임"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic size={14} />
        </TB>
        <TB
          title="밑줄"
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon size={14} />
        </TB>
        <TB
          title="인용"
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote size={14} />
        </TB>
        <TB title="링크" active={editor.isActive("link")} onClick={setLink}>
          <Link2 size={14} />
        </TB>
      </BubbleMenu>

      <EditorContent editor={editor} />
    </div>
  );
}
