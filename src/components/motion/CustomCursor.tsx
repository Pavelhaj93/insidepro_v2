"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { EyeIcon } from "@/components/icons/Eye";

const POINTER_FINE_QUERY = "(pointer: fine)";

function subscribePointerFine(callback: () => void) {
  const query = window.matchMedia(POINTER_FINE_QUERY);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function getPointerFineSnapshot() {
  return window.matchMedia(POINTER_FINE_QUERY).matches;
}

function usePointerFine() {
  return useSyncExternalStore(subscribePointerFine, getPointerFineSnapshot, () => false);
}

/**
 * Filled circular label that replaces the native cursor only while hovering
 * an element carrying `data-cursor` (event delegation, one listener) — e.g.
 * `data-cursor="case-study"` on the Yachak ProjectCard. It does NOT take over
 * the cursor site-wide: outside of a `data-cursor` target it renders nothing
 * and the OS cursor stays put. Fully inert on touch/coarse pointers and under
 * reduced motion; toggles a class on <html> so globals.css can hide the
 * native cursor only for the moments this is actually visible.
 */
export function CustomCursor() {
  const pointerFine = usePointerFine();
  const reduceMotion = useReducedMotion();
  const active = pointerFine && !reduceMotion;

  const [label, setLabel] = useState<string | null>(null);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });

  useEffect(() => {
    if (!active) return;

    function handlePointerMove(e: PointerEvent) {
      x.set(e.clientX);
      y.set(e.clientY);
    }

    function handlePointerOver(e: PointerEvent) {
      const target = e.target as Element | null;
      const cursorEl = target?.closest<HTMLElement>("[data-cursor]");
      const nextLabel = cursorEl?.dataset.cursor ?? null;
      setLabel(nextLabel);
      document.documentElement.classList.toggle("no-native-cursor", Boolean(nextLabel));
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerover", handlePointerOver);

    return () => {
      document.documentElement.classList.remove("no-native-cursor");
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerover", handlePointerOver);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  if (!active) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 z-200 pointer-events-none flex items-center justify-center rounded-full bg-brand-gold"
      style={{
        x: springX,
        y: springY,
        translateX: "-50%",
        translateY: "-50%",
      }}
      animate={{
        width: label ? 116 : 28,
        height: label ? 116 : 28,
        opacity: label ? 1 : 0,
      }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
    >
      {label === "case-study" ? (
        <span className="flex flex-col items-center justify-center gap-2 text-center text-brand-black px-3">
          <EyeIcon className="w-8 h-8" />
          <span className="font-display font-black text-[10px] uppercase tracking-wide">
            Case study
          </span>
        </span>
      ) : (
        <span className="font-display font-black text-[10px] uppercase tracking-wide text-brand-black text-center">
          {label}
        </span>
      )}
    </motion.div>
  );
}
