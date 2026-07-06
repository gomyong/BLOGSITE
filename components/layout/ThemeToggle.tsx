"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="다크모드 전환"
      className="p-2 text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-primary"
    >
      {/* 마운트 전에는 아이콘을 고정해 hydration mismatch 방지 */}
      {mounted && isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
