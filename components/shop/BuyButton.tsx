"use client";

import { useState } from "react";
import { Loader2, ShoppingBag } from "lucide-react";

/** Stripe Checkout 게스트 결제 버튼 */
export default function BuyButton({
  slug,
  soldOut,
}: {
  slug: string;
  soldOut: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleBuy() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, quantity: 1 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "결제를 시작할 수 없습니다.");
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "오류가 발생했습니다.");
      setLoading(false);
    }
  }

  if (soldOut) {
    return (
      <button
        disabled
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-surface-container-high px-5 py-3 text-[15px] font-semibold text-on-surface-variant"
      >
        품절되었습니다
      </button>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleBuy}
        disabled={loading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-on-surface px-5 py-3 text-[15px] font-semibold text-surface transition-transform hover:-translate-y-0.5 disabled:opacity-60"
      >
        {loading ? (
          <Loader2 size={17} className="animate-spin" />
        ) : (
          <>
            <ShoppingBag size={17} /> 구매하기
          </>
        )}
      </button>
      {error && <p className="mt-2 text-center text-[13px] text-error">{error}</p>}
      <p className="mt-2 text-center text-[12px] text-on-surface-variant">
        게스트 결제 · 카드 결제는 Stripe로 안전하게 처리됩니다
      </p>
    </div>
  );
}
