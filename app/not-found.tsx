import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-article flex-col items-start px-6 py-40 md:px-0">
      <p className="text-xs font-medium uppercase tracking-[0.35em] text-neutral-400 dark:text-neutral-500">
        404
      </p>
      <h1 className="mt-8 text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
        페이지를 찾을 수 없습니다.
      </h1>
      <Link
        href="/"
        className="mt-12 text-sm text-neutral-500 underline underline-offset-4 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-50"
      >
        ← 홈으로 돌아가기
      </Link>
    </div>
  );
}
