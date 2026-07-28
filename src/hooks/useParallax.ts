"use client";

import { useRef } from "react";
import { useScroll, useTransform } from "framer-motion";

type UseParallaxOptions = {
  /** Percentage of vertical travel across the section's scroll range. */
  intensity?: number;
  direction?: "up" | "down";
};

/**
 * Generalizes the sticky-slide parallax math from ClientsShowcaseSection into a
 * reusable hook: attach `ref` to the section wrapper, apply `y` as a motion style
 * on an absolutely-positioned, slightly-scaled-up inner layer (to avoid edge gaps).
 */
export function useParallax({
  intensity = 15,
  direction = "up",
}: UseParallaxOptions = {}) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const range =
    direction === "up"
      ? [`${intensity}%`, `-${intensity}%`]
      : [`-${intensity}%`, `${intensity}%`];

  const y = useTransform(scrollYProgress, [0, 1], range);

  return { ref, y };
}
