"use client";

import { motion } from "framer-motion";

/**
 * PRD 3.2 — Scroll-driven Text Reveal.
 * y: 15, opacity: 0, blur(4px) → y: 0, opacity: 1, blur(0px)
 */
export default function FadeIn({
  children,
  delay = 0,
  as = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  as?: "div" | "section";
}) {
  const Tag = as === "section" ? motion.section : motion.div;
  return (
    <Tag
      initial={{ y: 15, opacity: 0, filter: "blur(4px)" }}
      whileInView={{ y: 0, opacity: 1, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </Tag>
  );
}
