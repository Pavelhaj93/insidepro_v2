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
 * rendered height directly and forcing a resync on every change closes
 * that gap without needing every height-changing component to know about
 * Lenis itself.
 */
function LenisBodyResizeSync() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;
    const observer = new ResizeObserver(() => lenis.resize());
    observer.observe(document.body);
    return () => observer.disconnect();
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
    return <>{children}</>;
  }

  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.2 }}>
      <LenisBodyResizeSync />
      <ScrollResetOnNavigate />
      {children}
    </ReactLenis>
  );
}
