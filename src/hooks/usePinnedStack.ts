"use client";

import { useTransform, type MotionValue } from "framer-motion";

export type SlideWindow = {
  start: number;
  end: number;
  /** This slide's own progress through its scroll window, 0→1. */
  progress: MotionValue<number>;
  /** Depth cue for the outgoing slide — eases from 1 to 0.94 across the window. */
  depthScale: MotionValue<number>;
};

/**
 * Extracted from ClientsShowcaseSection's ClientSlide: each item occupies
 * `1/total` of the parent's scroll range, windowed to its own 0→1 progress.
 */
export function useSlideWindow(
  scrollYProgress: MotionValue<number>,
  index: number,
  total: number,
): SlideWindow {
  const start = total > 0 ? index / total : 0;
  const end = total > 0 ? (index + 1) / total : 1;

  const progress = useTransform(scrollYProgress, [start, end], [0, 1]);
  const depthScale = useTransform(scrollYProgress, [start, end], [1, 0.94]);

  return { start, end, progress, depthScale };
}
