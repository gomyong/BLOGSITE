"use client";

import { motion } from "framer-motion";

/** 본문 블록용 리빌 래퍼 — y:15 / opacity:0 / blur(4px) → 해제 (PRD 3.2 스펙) */
export default function RevealBlock({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ y: 15, opacity: 0, filter: "blur(4px)" }}
      whileInView={{ y: 0, opacity: 1, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
