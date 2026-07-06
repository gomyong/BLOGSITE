"use client";

import { useState } from "react";
import { Mail, Loader2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Status = "idle" | "loading" | "success" | "error";

interface NewsletterFormProps {
  /** compact: 본문 삽입형 / card: 사이드바·하단 강조형 */
  variant?: "compact" | "card";
  title?: string;
  description?: string;
}

export default function NewsletterForm({
  variant = "card",
  title = "뉴스레터 구독",
  description = "매주 한 번, 기술과 브랜드의 흐름을 짚어주는 인사이트를 메일함으로 보내드립니다.",
}: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || status === "loading") return;
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("subscribe failed");
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div
      className={cn(
        variant === "card" &&
          "rounded-2xl border border-ink-100 bg-ink-50 p-6 dark:border-ink-800 dark:bg-ink-900",
        variant === "compact" &&
          "my-10 rounded-2xl border border-dashed border-ink-200 p-6 dark:border-ink-700"
      )}
    >
      <div className="flex items-center gap-2">
        <Mail size={16} className="text-accent dark:text-accent-dark" />
        <h3 className="text-sm font-bold tracking-tight text-ink-950 dark:text-white">
          {title}
        </h3>
      </div>
      <p className="mt-2 text-[13px] leading-relaxed text-ink-500 dark:text-ink-400">
        {description}
      </p>

      {status === "success" ? (
        <p className="mt-4 flex items-center gap-1.5 text-sm font-medium text-accent dark:text-accent-dark">
          <Check size={15} /> 구독 신청이 완료되었습니다. 환영합니다!
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일 주소"
            className="min-w-0 flex-1 rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900 placeholder:text-ink-400 focus:border-accent focus:outline-none dark:border-ink-700 dark:bg-ink-950 dark:text-ink-100 dark:focus:border-accent-dark"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="shrink-0 rounded-lg bg-ink-950 px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-80 disabled:opacity-50 dark:bg-white dark:text-ink-950"
          >
            {status === "loading" ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              "구독"
            )}
          </button>
        </form>
      )}
      {status === "error" && (
        <p className="mt-2 text-xs text-red-500">
          구독 처리 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.
        </p>
      )}
    </div>
  );
}
