"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useLenis } from "lenis/react";

/**
 * Resets scroll to the top on every client-side route change (e.g. the
 * case-study prev/next pager navigating between two `/reference/[slug]`
 * pages) — without this, a soft navigation between two instances of the
 * same dynamic route can leave the page at whatever scroll position the
 * link was clicked from instead of starting at the top.
 *
 * Always resets native `window` scroll first — this is what actually
 * matters when Lenis is disabled (reduced motion). When Lenis is active it
 * also owns `window`'s scroll under the hood, so the native reset alone
 * would otherwise get fought/overridden by Lenis's next animation frame;
 * `useLenis()` resolves to `undefined` when there's no Lenis provider (e.g.
 * under reduced motion), so the extra calls are skipped safely.
 *
 * Lenis is mounted once at the root layout and persists across Next.js
 * client-side navigations — it does not know on its own that the page
 * changed. Left alone, it keeps both its scroll position and its cached
 * scroll-height limit from the previous page, which is what caused a new
 * page to sometimes load already scrolled down, or to hit a wall partway
 * through scrolling (a stale, too-short limit from the previous page).
 *
 * `resize()` recalculates the limit against the new page's actual height;
 * `scrollTo(0, { immediate: true })` snaps to the top with no animation.
 *
 * The ref guards against the initial mount: `lenis` starts `null` and flips
 * to its constructed instance shortly after, re-firing this effect once on
 * every load (including a hard refresh) even though the pathname never
 * changed — without the guard that snapped a mid-scroll reload back to the
 * top for a moment before native scroll restoration corrected it.
 */
export function ScrollResetOnNavigate() {
  const pathname = usePathname();
  const lenis = useLenis();
  const previousPathname = useRef(pathname);

  useEffect(() => {
    if (previousPathname.current === pathname) return;
    previousPathname.current = pathname;
    window.scrollTo(0, 0);
    lenis?.resize();
    lenis?.scrollTo(0, { immediate: true });
  }, [pathname, lenis]);

  return null;
}
