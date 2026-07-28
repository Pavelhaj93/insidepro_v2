import type { Variants } from "framer-motion";

// Matches the curve already used in Header.tsx for the scroll-bg reveal and menu-icon morph.
export const EASE_OUT_EXPO = [0.22, 1, 0.36, 1] as const;

export const DURATION = 0.7;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export function staggerContainer(
  stagger = 0.1,
  delayChildren = 0,
): Variants {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren: stagger, delayChildren },
    },
  };
}
