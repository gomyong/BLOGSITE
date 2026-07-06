"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** PRD 3.2 — 화면 최상단 1px 초미니멀 독서 진행률 바 */
export default function ProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-50 h-px origin-left bg-neutral-900 dark:bg-neutral-50"
      style={{ scaleX }}
    />
  );
}
