"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const SESSION_KEY = "insidepro-intro-seen";
const AUTO_DISMISS_MS = 1300;

/**
 * One-time, session-gated intro: logo mark fades in, then the whole overlay
 * curtain-wipes up off the page. Plays once per browser session (sessionStorage
 * flag), auto-dismisses after ~1.3s, or dismisses immediately on click. Skipped
 * entirely under reduced motion — no flash, no delay, nothing rendered.
 */
export function IntroLoader() {
  const reduceMotion = useReducedMotion();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (reduceMotion) return;
    if (sessionStorage.getItem(SESSION_KEY)) return;

    // One-time sessionStorage check: there's no render-safe way to read this
    // before hydration, so the loader can only be revealed from an effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShow(true);
    sessionStorage.setItem(SESSION_KEY, "1");
    const timer = setTimeout(() => setShow(false), AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [reduceMotion]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-150 bg-brand-black flex items-center justify-center cursor-pointer origin-top"
          exit={{ scaleY: 0 }}
          transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
          onClick={() => setShow(false)}
        >
          <motion.span
            className="font-display font-black text-2xl uppercase tracking-[0.3em] text-brand-gold"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            insidePRO
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
