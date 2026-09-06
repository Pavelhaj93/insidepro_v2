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
  scrollHeightVh = 220,
  scaleTarget = 40,
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

  const textScale = useTransform(scrollYProgress, [0, 0.55], [1, scaleTarget]);
  const colorOpacity = useTransform(scrollYProgress, [0.42, 0.58], [0, 1]);
  const labelOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  // Scaling the whole headline from its box-center is what causes the "zooms
  // into black" bug: at 14x, the center of a multi-word string is just as
  // likely to be a space/comma as it is a letter. Instead, pin the scale's
  // transform-origin to one specific glyph near the middle so the zoom is
  // always directed into solid ink.
  const anchorIndex = useMemo(() => findAnchorIndex(headline), [headline]);
  const before = headline.slice(0, anchorIndex);
  const anchorChar = headline[anchorIndex] ?? "";
  const after = headline.slice(anchorIndex + 1);

  const [origin, setOrigin] = useState({ x: 50, y: 50 });

  useLayoutEffect(() => {
    const headlineEl = headlineRef.current;
    const anchorEl = anchorRef.current;
    if (!headlineEl || !anchorEl) return;

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
  }, [headline]);

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
            className="relative z-10 font-display font-black uppercase text-[12vw] leading-none text-center px-4 select-none whitespace-pre-wrap"
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
