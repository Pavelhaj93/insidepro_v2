"use client";

import { useEffect } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { ScrollResetOnNavigate } from "./ScrollResetOnNavigate";

/**
 * Lenis's own ResizeObserver (on `document.documentElement`) doesn't
 * reliably catch height changes driven by in-page animations — an accordion
 * row expanding via a `height: auto` framer-motion animation, a late-loading
 * image, a scroll-reveal — so its cached scroll limit can go stale short of
 * the page's true bottom. That silently caps wheel/trackpad-driven
 * scrolling well before the real end of the page (dragging the native
 * scrollbar thumb still reaches it, since that sets `scrollTop` directly
 * instead of going through Lenis's wheel handling). Watching `body`'s
 * rendered height directly and forcing a resync closes that gap without
 * needing every height-changing component to know about Lenis itself.
 *
 * The resync is debounced (trailing edge only) rather than fired on every
 * observer tick: a `height: auto` accordion expand re-triggers this
 * observer on essentially every animation frame, and calling `lenis.resize()`
 * that often while the user is mid-scroll made the scroll visibly stutter/
 * pause for the duration of the expand. Waiting until the height has
 * settled for a moment still keeps the scroll limit in sync soon after the
 * animation ends, without recalculating on every frame while it's running.
 */
function LenisBodyResizeSync() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    let timeoutId: number | undefined;
    const observer = new ResizeObserver(() => {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => lenis.resize(), 200);
    });
    observer.observe(document.body);

    return () => {
      window.clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [lenis]);

  return null;
}

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
    return (
      <>
        <ScrollResetOnNavigate />
        {children}
      </>
    );
  }

  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.2 }}>
      <LenisBodyResizeSync />
      <ScrollResetOnNavigate />
      {children}
    </ReactLenis>
  );
}
