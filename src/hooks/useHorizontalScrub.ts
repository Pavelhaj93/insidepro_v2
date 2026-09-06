"use client";

import { useRef } from "react";
import { useScroll, useTransform } from "framer-motion";

/** Left/right gutter of the scrubbed track, in vw — kept as a shared
 * constant so the geometry consumers use for centering math (which card is
 * "in the middle") stays in sync with the actual rendered padding. */
export const EDGE_PADDING_VW = 8;

type UseHorizontalScrubOptions = {
  itemCount: number;
  /** Width of one card, in vw. */
  itemWidthVw?: number;
  /** Gap between cards, in vw. */
  gapVw?: number;
  /**
   * vw the track starts pushed right of its resting position, so the first
   * card enters from off-screen as the section is first scrolled into. 0
   * (default) keeps the original behavior of starting at rest.
   */
  entryVw?: number;
  /**
   * Resting position (vw) the track settles at once the entry finishes,
   * before normal cycling continues — lets the first card land nearer
   * center instead of flush against the left padding. Only meaningful
   * together with `entryVw`.
   */
  restVw?: number;
  /**
   * Fraction (0-1) of the scroll range spent on the entry before normal
   * cycling starts — kept small so the entry reads as an immediate,
   * responsive slide-in rather than eating a big chunk of the scroll
   * budget shared with cycling through every other card.
   */
  entryProgress?: number;
  /**
   * Fraction (0-1) of the viewport height the wrapper's top can be down
   * from the viewport top before the scrub starts. 0 (default) waits until
   * the wrapper's top exactly reaches the viewport top, i.e. the instant
   * the sticky pin visually engages. Before that instant the wrapper is
   * still plain document content scrolling normally into view, so the
   * label/first card can already be comfortably on-screen for a while with
   * the scrub frozen at 0 — a felt "dead zone" before anything moves.
   * Passing e.g. 0.25 starts the scrub a little earlier, while the section
   * is still scrolling in, so motion is already under way by the time the
   * pin engages instead of snapping to catch up.
   */
  startAt?: number;
  /**
   * Mirror of `startAt` for the tail end: fraction (0-1) of viewport height
   * the wrapper's *bottom* edge can be down when the scrub finishes. 1
   * (default) matches "end end" — finishes the instant the pin would
   * naturally release. A smaller value, e.g. 0.2, keeps the scrub running
   * a bit past that point, while the (now unstuck) wrapper is already
   * scrolling up out of view — so the last card's exit keeps animating
   * through the handoff to the next section instead of freezing the
   * moment the pin lets go.
   */
  endAt?: number;
};

/**
 * Drives a horizontal track from vertical scroll over a tall sticky
 * wrapper — the vertical scroll budget it needs is exposed via
 * `wrapperRef`'s consumer setting `height: ${itemCount * 60 + 100}vh`.
 * Returns a *numeric* vw motion value (not a pre-formatted "Npx" string) so
 * callers can do position math with it — e.g. working out which card is
 * currently centered on screen — rather than only feeding it into a CSS
 * transform.
 */
export function useHorizontalScrub({
  itemCount,
  itemWidthVw = 70,
  gapVw = 4,
  entryVw = 0,
  restVw = 0,
  entryProgress = 0.15,
  startAt = 0,
  endAt = 1,
}: UseHorizontalScrubOptions) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: [`start ${startAt}`, `end ${endAt}`],
  });

  const travelVw = Math.max(itemCount - 1, 0) * (itemWidthVw + gapVw);
  // Extra travel past the last card's normal rest position so it fully
  // clears the left edge instead of the pin releasing while it's still
  // sitting fully visible (which reads as "stuck").
  const exitVw = itemWidthVw + EDGE_PADDING_VW;
  const finalVw = -(travelVw + exitVw);

  const hasEntry = entryVw !== 0 || restVw !== 0;
  const xVw = useTransform(
    scrollYProgress,
    hasEntry ? [0, entryProgress, 1] : [0, 1],
    hasEntry ? [entryVw, restVw, finalVw] : [0, finalVw],
  );

  return { wrapperRef, xVw, scrollYProgress };
}
