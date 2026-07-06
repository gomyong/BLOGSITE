"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";

export default function LoginForm({ enabled }: { enabled: boolean }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.refresh();
    } else {
      const json = await res.json().catch(() => ({}));
      setError(json.error ?? "로그인에 실패했습니다.");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-sm flex-col justify-center px-[20px]">
      <div className="border border-outline-variant bg-surface-container-lowest p-lg">
        <div className="flex items-center gap-xs">
          <Lock size={16} className="text-primary" />
          <h1 className="font-headline text-headline-md font-bold text-on-surface">
            스튜디오 로그인
          </h1>
        </div>
        {enabled ? (
          <form onSubmit={handleSubmit} className="mt-md space-y-sm">
            <input
              type="password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호"
              className="w-full border border-outline-variant bg-surface px-sm py-xs text-body-md text-on-surface placeholder:text-outline focus:border-primary focus:outline-none"
            />
            {error && <p className="text-xs text-error">{error}</p>}
            <button
              type="submit"
              disabled={loading || !password}
              className="flex w-full items-center justify-center gap-xs bg-primary-container py-xs font-label text-label-sm text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : "입장"}
            </button>
          </form>
        ) : (
          <p className="mt-md text-body-md leading-relaxed text-on-surface-variant">
            스튜디오가 비활성화되어 있습니다. Vercel 환경변수에{" "}
            <code className="bg-surface-container-low px-1 font-code text-[12px]">
              ADMIN_PASSWORD
            </code>
            를 설정한 뒤 재배포하세요.
          </p>
        )}
      </div>
    </div>
  );
}
