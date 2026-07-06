"use client";

import { useState } from "react";
import { ArrowRight, Loader2, Check } from "lucide-react";
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
  title = "주간 시그널",
  description = "구조적 디자인과 프론트엔드 엔지니어링의 교차점에서 큐레이션된 인사이트.",
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
        "border border-outline-variant p-md",
        variant === "card" && "bg-surface-container-low",
        variant === "compact" && "my-10 bg-surface-container-lowest"
      )}
    >
      <h3 className="font-headline text-headline-md font-semibold text-on-surface">
        {title}
      </h3>
      <p className="mt-xs text-body-md text-on-surface-variant">
        {description}
      </p>

      {status === "success" ? (
        <p className="mt-md flex items-center gap-1.5 text-sm font-medium text-primary">
          <Check size={15} /> 구독 신청이 완료되었습니다. 환영합니다!
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-md flex">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일 주소"
            className="min-w-0 flex-1 border border-outline-variant bg-surface-container-lowest px-sm py-xs text-body-md text-on-surface placeholder:text-outline focus:border-primary focus:outline-none focus:ring-0"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            aria-label="뉴스레터 구독 신청"
            className="shrink-0 border border-on-surface bg-on-surface px-md text-surface transition-colors hover:border-primary-container hover:bg-primary-container hover:text-white disabled:opacity-50"
          >
            {status === "loading" ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <ArrowRight size={18} />
            )}
          </button>
        </form>
      )}
      {status === "error" && (
        <p className="mt-xs text-xs text-error">
          구독 처리 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.
        </p>
      )}
    </div>
  );
}
