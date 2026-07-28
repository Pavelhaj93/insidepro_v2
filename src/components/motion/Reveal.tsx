"use client";

import type { CSSProperties, ReactNode } from "react";
import { motion, type Variants } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { DURATION, EASE_OUT_EXPO, fadeUp, staggerContainer } from "@/lib/motion";

type RevealProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  variants?: Variants;
  delay?: number;
  duration?: number;
  once?: boolean;
  amount?: number;
};

/** Fades/slides its children in once they scroll into view. Above-the-fold content plays on mount. */
export function Reveal({
  children,
  variants = fadeUp,
  delay = 0,
  duration = DURATION,
  once = true,
  amount = 0.3,
  className,
  style,
}: RevealProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      style={style}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={variants}
      transition={{ duration, ease: EASE_OUT_EXPO, delay }}
    >
      {children}
    </motion.div>
  );
}

type RevealStaggerProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  stagger?: number;
  delayChildren?: number;
  once?: boolean;
  amount?: number;
};

/** Wraps a grid/list container; child <RevealItem>s reveal one after another. */
export function RevealStagger({
  children,
  stagger = 0.1,
  delayChildren = 0,
  once = true,
  amount = 0.2,
  className,
  style,
}: RevealStaggerProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      style={style}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={staggerContainer(stagger, delayChildren)}
    >
      {children}
    </motion.div>
  );
}

type RevealItemProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  variants?: Variants;
};

/** A single item inside a <RevealStagger>; inherits reveal timing from the parent's stagger. */
export function RevealItem({
  children,
  variants = fadeUp,
  className,
  style,
}: RevealItemProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      style={style}
      variants={variants}
      transition={{ duration: DURATION, ease: EASE_OUT_EXPO }}
    >
      {children}
    </motion.div>
  );
}
