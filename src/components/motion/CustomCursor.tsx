"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

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
 * Ring + dot that replaces the native cursor on desktop fine-pointer devices.
 * Reads `data-cursor` off whatever's under the pointer (event delegation, one
 * listener) to swap its label — e.g. `data-cursor="view"` on ProjectCard,
 * `data-cursor="link"` on nav items. Fully inert on touch/coarse pointers and
 * under reduced motion; toggles a class on <html> so globals.css can hide the
 * native cursor only while this is actually active.
 */
export function CustomCursor() {
  const pointerFine = usePointerFine();
  const reduceMotion = useReducedMotion();
  const active = pointerFine && !reduceMotion;

  const [label, setLabel] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });

  useEffect(() => {
    if (!active) return;

    document.documentElement.classList.add("no-native-cursor");

    function handlePointerMove(e: PointerEvent) {
      x.set(e.clientX);
      y.set(e.clientY);
      if (!visible) setVisible(true);
    }

    function handlePointerOver(e: PointerEvent) {
      const target = e.target as Element | null;
      const cursorEl = target?.closest<HTMLElement>("[data-cursor]");
      setLabel(cursorEl?.dataset.cursor ?? null);
    }

    function handlePointerLeaveWindow() {
      setVisible(false);
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerover", handlePointerOver);
    document.documentElement.addEventListener("pointerleave", handlePointerLeaveWindow);

    return () => {
      document.documentElement.classList.remove("no-native-cursor");
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerover", handlePointerOver);
      document.documentElement.removeEventListener("pointerleave", handlePointerLeaveWindow);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  if (!active) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 z-200 pointer-events-none flex items-center justify-center"
      style={{
        x: springX,
        y: springY,
        translateX: "-50%",
        translateY: "-50%",
        opacity: visible ? 1 : 0,
      }}
      animate={{
        width: label ? 64 : 28,
        height: label ? 64 : 28,
      }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="absolute inset-0 rounded-full border border-brand-gold/70" />
      {label && (
        <span className="font-display font-black text-[10px] uppercase tracking-wide text-brand-gold">
          {label}
        </span>
      )}
    </motion.div>
  );
}
