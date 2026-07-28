"use client";

import { motion } from "framer-motion";
import { useParallax } from "@/hooks/useParallax";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type Props = {
  children: React.ReactNode;
  intensity?: number;
};

/**
 * Drop-in replacement for a plain `absolute inset-0` image wrapper — the child
 * (typically a `next/image` with `fill`) drifts slightly on scroll. The `scale-110`
 * on the inner layer keeps the drifted image covering the frame with no edge gaps,
 * matching the pattern already used in ClientsShowcaseSection.
 */
export function ParallaxLayer({ children, intensity = 12 }: Props) {
  const { ref, y } = useParallax({ intensity });
  const reduceMotion = useReducedMotion();

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      {reduceMotion ? (
        <div className="absolute inset-0">{children}</div>
      ) : (
        <motion.div className="absolute inset-0 scale-110" style={{ y }}>
          {children}
        </motion.div>
      )}
    </div>
  );
}
