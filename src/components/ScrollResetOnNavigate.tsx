"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLenis } from "lenis/react";

/**
 * Lenis is mounted once at the root layout and persists across Next.js
 * client-side navigations — it does not know on its own that the page
 * changed. Left alone, it keeps both its scroll position and its cached
 * scroll-height limit from the previous page, which is what caused a new
 * page to sometimes load already scrolled down, or to hit a wall partway
 * through scrolling (a stale, too-short limit from the previous page).
 *
 * `resize()` recalculates the limit against the new page's actual height;
 * `scrollTo(0, { immediate: true })` snaps to the top with no animation.
 */
export function ScrollResetOnNavigate() {
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    lenis?.resize();
    lenis?.scrollTo(0, { immediate: true });
  }, [pathname, lenis]);

  return null;
}
