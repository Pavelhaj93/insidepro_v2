"use client";

import { useMotionValue, useSpring, useTransform } from "framer-motion";
import type { MouseEvent } from "react";

type UseMagneticTiltOptions = {
  /** Max rotation in degrees / translation in px at the pointer's extremes. */
  strength?: number;
  disabled?: boolean;
};

/**
 * Cursor-following tilt/magnetic effect: tracks pointer position relative to
 * the target element's bounding box (-0.5..0.5 on each axis) and springs a
 * small rotateX/rotateY/x/y transform toward it, resetting to neutral on
 * mouse-leave. Spread `onMouseMove`/`onMouseLeave` onto the target element
 * and apply `style` to it (or a motion.* wrapper around it).
 */
export function useMagneticTilt({
  strength = 10,
  disabled = false,
}: UseMagneticTiltOptions = {}) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const springConfig = { stiffness: 300, damping: 20, mass: 0.4 };

  const rotateX = useSpring(
    useTransform(my, [-0.5, 0.5], [strength, -strength]),
    springConfig
  );
  const rotateY = useSpring(
    useTransform(mx, [-0.5, 0.5], [-strength, strength]),
    springConfig
  );
  const x = useSpring(
    useTransform(mx, [-0.5, 0.5], [-strength * 0.8, strength * 0.8]),
    springConfig
  );
  const y = useSpring(
    useTransform(my, [-0.5, 0.5], [-strength * 0.8, strength * 0.8]),
    springConfig
  );

  function onMouseMove(e: MouseEvent<HTMLElement>) {
    if (disabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function onMouseLeave() {
    mx.set(0);
    my.set(0);
  }

  return { style: { rotateX, rotateY, x, y }, onMouseMove, onMouseLeave };
}
