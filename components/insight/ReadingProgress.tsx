"use client";

import { useEffect, useState } from "react";

/** 페이지 스크롤 기반 읽기 진행률 바 (헤더 아래 고정) */
export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function onScroll() {
      const total =
        document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? Math.min(window.scrollY / total, 1) : 0);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed inset-x-0 top-16 z-30 h-0.5 bg-transparent">
      <div
        className="h-full bg-accent transition-[width] duration-150 ease-out dark:bg-accent-dark"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  );
}
