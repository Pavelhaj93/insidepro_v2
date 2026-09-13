"use client";

import { useSyncExternalStore } from "react";

// Matches the project's mobile/tablet/desktop breakpoint convention:
// mobile < 640px, tablet 640-1023px (Tailwind `sm:`), desktop 1024px+ (`lg:`).
const MOBILE_QUERY = "(max-width: 639px)";

function subscribe(callback: () => void) {
  const query = window.matchMedia(MOBILE_QUERY);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function getSnapshot() {
  return window.matchMedia(MOBILE_QUERY).matches;
}

function getServerSnapshot() {
  return false;
}

/**
 * For the (rarer) cases where a breakpoint has to reach into JS/framer-motion
 * logic (slide direction, transform math) rather than just CSS classes.
 * Prefer plain Tailwind responsive classes wherever the difference is purely
 * visual.
 */
export function useIsMobile() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
