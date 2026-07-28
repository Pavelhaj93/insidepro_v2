"use client";

import { ReactLenis } from "lenis/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Wires up Lenis smooth-scroll physics for the whole document (`root`, no wrapper
 * divs — window scroll stays the source of truth for Framer Motion's `useScroll`
 * calls elsewhere). Fully disabled under reduced motion, falling back to native scroll.
 */
export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <>{children}</>;
  }

  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.2 }}>
      {children}
    </ReactLenis>
  );
}
