import type Lenis from "lenis";

/**
 * Jumps straight to an in-page anchor (`#some-id`) — Lenis owns the actual
 * scroll position every animation frame while it's mounted, so a plain
 * native anchor-link jump gets immediately fought/reset by it (this is the
 * same class of problem `ScrollResetOnNavigate.tsx` solves for route
 * changes). Routing the jump through Lenis's own `scrollTo` instead is what
 * actually lands there — `immediate: true` skips the smooth-scroll
 * animation entirely, since the effect wanted here is "land on the
 * section", not "watch it scroll past".
 */
export function scrollToAnchor(lenis: Lenis | undefined, hash: string) {
  if (lenis) {
    lenis.scrollTo(hash, { immediate: true });
    return;
  }
  document.querySelector(hash)?.scrollIntoView();
}
