"use client";

import { useEffect, useRef } from "react";
import { siteConfig } from "@/lib/site";

interface CopyAttributionProps {
  title: string;
  url: string;
  children: React.ReactNode;
}

/**
 * 감싼 영역 안에서 텍스트를 복사하면 클립보드에 출처 표기를 자동으로 덧붙인다.
 * 복사 자체는 막지 않고, 붙여넣었을 때 출처가 함께 따라가도록 하는 방식.
 */
export default function CopyAttribution({
  title,
  url,
  children,
}: CopyAttributionProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    function onCopy(event: ClipboardEvent) {
      const selection = window.getSelection()?.toString();
      if (!selection || !event.clipboardData) return;

      const attribution = `\n\n출처: "${title}" — ${siteConfig.name} (${url})`;
      event.clipboardData.setData("text/plain", selection + attribution);
      event.preventDefault();
    }

    node.addEventListener("copy", onCopy);
    return () => node.removeEventListener("copy", onCopy);
  }, [title, url]);

  return <div ref={ref}>{children}</div>;
}
