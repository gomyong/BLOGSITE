import Link from "next/link";
import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "주문 완료",
  robots: { index: false },
};

export default function CheckoutSuccessPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-[20px] text-center">
      <CheckCircle2 size={48} className="text-accent" />
      <h1 className="mt-md font-headline text-[26px] font-extrabold tracking-tight text-on-surface">
        주문이 완료되었습니다
      </h1>
      <p className="mt-3 text-[15px] leading-relaxed text-on-surface-variant">
        결제해 주셔서 감사합니다. 주문 확인 메일을 보내드렸어요. 배송 준비가
        되는 대로 다시 안내드리겠습니다.
      </p>
      <div className="mt-lg flex gap-3">
        <Link
          href="/shop"
          className="rounded-full border border-outline-variant px-5 py-2.5 text-[14px] font-semibold text-on-surface transition-colors hover:border-on-surface"
        >
          편집샵으로
        </Link>
        <Link
          href="/"
          className="rounded-full bg-on-surface px-5 py-2.5 text-[14px] font-semibold text-surface"
        >
          홈으로
        </Link>
      </div>
    </div>
  );
}
