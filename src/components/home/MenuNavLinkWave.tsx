"use client";

import { motion } from "framer-motion";

type Props = { label: string; isActive: boolean; reduceMotion: boolean };

export function MenuNavLinkWave({ label, isActive, reduceMotion }: Props) {
  return (
    <span aria-hidden="true" className="inline-flex">
      {label.split("").map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          className="inline-block"
          animate={
            reduceMotion
              ? {
                  color: isActive
                    ? "var(--color-brand-gold)"
                    : "var(--color-brand-light)",
                }
              : isActive
                ? {
                    y: [0, -8, 0],
                    color: [
                      "var(--color-brand-light)",
                      "var(--color-brand-gold)",
                      "var(--color-brand-light)",
                    ],
                  }
                : { y: 0, color: "var(--color-brand-light)" }
          }
          transition={
            reduceMotion
              ? { duration: 0.15 }
              : isActive
                ? {
                    duration: 0.9,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.045,
                  }
                : { duration: 0.2 }
          }
        >
          {char === " " ? " " : char}
        </motion.span>
      ))}
    </span>
  );
}
