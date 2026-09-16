"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// Characters that read as "empty" at extreme zoom — never anchor the zoom
// origin on one of these, or the effect ends up magnifying background
// instead of the headline's own ink.
const SKIP_CHARS = new Set([
  " ",
  ",",
  ".",
  "!",
  "?",
  "'",
  '"',
  "-",
  "–",
  "—",
  "(",
  ")",
  ":",
  ";",
]);

/** Nearest non-space/punctuation character to the headline's midpoint. */
function findAnchorIndex(text: string): number {
  if (!text) return 0;
  const middle = Math.floor(text.length / 2);
  for (let offset = 0; offset < text.length; offset++) {
    const right = middle + offset;
    const left = middle - offset;
    if (right < text.length && !SKIP_CHARS.has(text[right])) return right;
    if (left >= 0 && !SKIP_CHARS.has(text[left])) return left;
  }
  return middle;
}

type ZoomTextTransitionProps = {
  label?: string;
  headline: string;
  /** CSS color value the headline scales into and the full-bleed layer fades to. */
  accentColor?: string;
  /** Total scroll budget for the effect, in vh. */
  scrollHeightVh?: number;
  /** How large the headline scales before the color layer takes over. */
  scaleTarget?: number;
  /**
   * Character index in `headline` to zoom into, overriding the automatic
   * nearest-to-middle pick (see `findAnchorIndex`) — use this when the
   * default lands on a glyph you don't want (e.g. an accented vowel) and you
   * want a specific letter instead.
   */
  anchorIndex?: number;
  className?: string;
};

/**
 * Scroll scales a headline up until its fill color becomes the full-viewport
 * background, then releases — the next block in the page hands off the
 * "new scene" for free through normal document order. See
 * ZoomTextTransition's mechanic writeup in the scroll-effects POC plan.
 */
export function ZoomTextTransition({
  label,
  headline,
  accentColor = "var(--color-brand-gold)",
  // 220vh gave ~90vh of "dead scroll" after the color layer already hit full
  // opacity (see colorOpacity below) — more total distance than this effect
  // needs. 160vh keeps the zoom feeling deliberate, not rushed, while cutting
  // the wasted tail once colorOpacity and scaleProgress are retimed to both
  // finish near the end of the range instead of the middle.
  scrollHeightVh = 160,
  // Paired with the smaller text-[7vw] starting size below: 7 * 70 = 490,
  // essentially the same final effective size as the old 12vw * 40 = 480 —
  // so full-viewport ink coverage at max zoom is preserved even though the
  // headline now starts noticeably smaller (and needs more relative zoom,
  // hence more scroll, to get there).
  scaleTarget = 70,
  anchorIndex: anchorIndexProp,
  className,
}: ZoomTextTransitionProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const anchorRef = useRef<HTMLSpanElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  // A linear 1 → scaleTarget scale reads as a huge jump right at the start:
  // going from 1x to 2x (a small slice of scroll) is a much bigger *visual*
  // leap than going from 20x to 21x (an equally small slice, later on), even
  // though both are the same absolute scale delta. Interpolating in log
  // space instead (scale = scaleTarget^progress) makes each equal step of
  // scroll multiply the scale by the same factor, so the zoom feels like a
  // constant rate throughout instead of front-loaded.
  // scaleProgress used to finish at 0.55 with colorOpacity ramping over
  // [0.42, 0.58] — i.e. the color layer hit full opacity at just 58% of the
  // pinned scroll range, leaving the remaining 42% (~90+vh at the old 220vh
  // default) as dead scroll: the screen was already flat color with nothing
  // left to animate, but the section wouldn't release until that whole tail
  // was scrolled through. Both curves are now retimed to finish close to the
  // *end* of the range instead of the middle, so the pinned section releases
  // (and the next block starts appearing) almost as soon as the screen goes
  // solid. The zoom still finishes first and the color continues ramping
  // briefly after — same overlap relationship as before, just shifted later
  // — so it still reads as one motion (zoom growing into the color) rather
  // than two disjointed ones.
  const scaleProgress = useTransform(scrollYProgress, [0, 0.85], [0, 1]);
  const textScale = useTransform(scaleProgress, (p) =>
    Math.pow(scaleTarget, p),
  );
  const colorOpacity = useTransform(scrollYProgress, [0.72, 0.95], [0, 1]);
  const labelOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  // Scaling the whole headline from its box-center is what causes the "zooms
  // into black" bug: at 14x, the center of a multi-word string is just as
  // likely to be a space/comma as it is a letter. Instead, pin the scale's
  // transform-origin to one specific glyph near the middle so the zoom is
  // always directed into solid ink.
  const anchorIndex = useMemo(
    () => anchorIndexProp ?? findAnchorIndex(headline),
    [headline, anchorIndexProp],
  );
  const before = headline.slice(0, anchorIndex);
  const anchorChar = headline[anchorIndex] ?? "";
  const after = headline.slice(anchorIndex + 1);

  const [origin, setOrigin] = useState({ x: 50, y: 50 });

  useLayoutEffect(() => {
    const headlineEl = headlineRef.current;
    const anchorEl = anchorRef.current;
    if (!headlineEl || !anchorEl) return;

    // Origin is measured directly from the anchor character's own rendered
    // position — the headline's asymmetric side padding (see its className)
    // already shifts the *rendered text* to sit centered on the visible
    // content area (right of the fixed VerticalSidebar), so measuring the
    // anchor's actual box is what picks up that shift correctly. (A version
    // of this that instead hardcoded the origin to the viewport's own
    // content-center double-counted the shift — the padding had already
    // moved the text there, so adding a second correction on top of it
    // overshot to the right. Don't reintroduce that.)
    const measure = () => {
      const headlineRect = headlineEl.getBoundingClientRect();
      const anchorRect = anchorEl.getBoundingClientRect();
      if (headlineRect.width === 0 || headlineRect.height === 0) return;
      setOrigin({
        x:
          ((anchorRect.left + anchorRect.width / 2 - headlineRect.left) /
            headlineRect.width) *
          100,
        y:
          ((anchorRect.top + anchorRect.height / 2 - headlineRect.top) /
            headlineRect.height) *
          100,
      });
    };

    measure();
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure);
    return () => window.removeEventListener("resize", measure);
  }, [headline, anchorIndex]);

  if (reduceMotion) {
    return (
      <section
        className={`flex flex-col items-center justify-center gap-6 px-8 py-32 text-center bg-brand-black ${className ?? ""}`}
      >
        {label && (
          <p className="font-body text-sm tracking-widest uppercase text-brand-light/60">
            {label}
          </p>
        )}
        <h2
          className="font-display font-black uppercase text-4xl sm:text-5xl md:text-6xl leading-tight"
          style={{ color: accentColor }}
        >
          {headline}
        </h2>
      </section>
    );
  }

  return (
    <>
      {/*
        position: fixed (not nested inside the sticky/overflow-hidden viewport
        below) so once this reaches full opacity it keeps covering the whole
        screen for the rest of the scroll, instead of scrolling away the
        instant this section's own sticky pin releases. Its opacity only ever
        increases (per colorOpacity's clamped useTransform) — nothing here
        fades it back out, so the color genuinely persists as the new
        backdrop rather than snapping/fading back to black.
      */}
      <motion.div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{ backgroundColor: accentColor, opacity: colorOpacity }}
      />

      <section
        ref={wrapperRef}
        className={`bg-brand-black ${className ?? ""}`}
        style={{ height: `${scrollHeightVh}vh` }}
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
          {label && (
            <motion.p
              className="absolute top-16 font-body text-sm tracking-widest uppercase text-brand-light/60"
              style={{ opacity: labelOpacity }}
            >
              {label}
            </motion.p>
          )}

          <motion.h2
            ref={headlineRef}
            // Side padding in vw (matching the vw-based font size) rather
            // than a fixed px value, so the same padding-to-font-size ratio
            // — and therefore the same line breaks — holds at every
            // viewport width instead of only the one it was tuned against.
            // At sm+ the padding is split asymmetrically (still 20vw total,
            // so the available width — and therefore the line breaks —
            // don't change) to shift the centered text right by half the
            // fixed VerticalSidebar's width (w-20 = 5rem), landing it in the
            // middle of the visible content area instead of the full
            // viewport the sidebar eats into.
            className="relative z-10 w-full font-display font-black uppercase text-[7vw] leading-none text-center px-[10vw] sm:pl-[calc(10vw+2.5rem)] sm:pr-[calc(10vw-2.5rem)] select-none whitespace-pre-wrap"
            style={{
              color: accentColor,
              scale: textScale,
              transformOrigin: `${origin.x}% ${origin.y}%`,
            }}
          >
            {before}
            <span ref={anchorRef}>{anchorChar}</span>
            {after}
          </motion.h2>
        </div>
      </section>
    </>
  );
}
