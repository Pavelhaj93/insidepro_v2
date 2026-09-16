"use client";

import { useLayoutEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { usePathname } from "next/navigation";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { getPageLabel } from "@/lib/nav-links";

// Scroll budget (vh) dedicated purely to the curtain's own open/close
// gesture — this is also how long the hero stays genuinely pinned
// underneath before normal page scroll resumes. SplitVideoReveal needs
// 150vh+ because it's choreographing a much bigger reveal (two panels
// sliding fully clear of the frame) plus a hold and a handoff to the next
// section. A plain open/close curtain doesn't need nearly that much room —
// just enough to read as a deliberate scroll gesture rather than an instant
// flash. 120vh (a little over one screenful) feels right for both a single
// wheel notch and a slower trackpad swipe, without padding the page.
const CURTAIN_VH = 120;
// Total distance the label itself travels while opening — deliberately tiny
// (about one line of its own text) since it doesn't need to travel far to
// disappear: the clip box around it is sized to the text itself, so once it
// has moved up by roughly its own line height it has already fully exited
// past that box's top edge and been clipped away.
const LABEL_TRAVEL_PX = 100;
const ENTRANCE_EASE = [0.76, 0, 0.24, 1] as const;

type PageIntroCurtainProps = {
  /** The hero's own content — rendered underneath the curtain, sharing the
   * same pinned/sticky box so it's visible (just covered) from frame one. */
  children: ReactNode;
  className?: string;
};

/**
 * The pinned scroll mechanism, mirroring `SplitVideoReveal`: a wrapper taller
 * than its sticky child provides scroll room for the child to stay pinned
 * in, while `scrollYProgress`-equivalent motion drives every visual. Unlike
 * `SplitVideoReveal` (whose sticky child is a fixed `h-screen`, so its own
 * `useScroll({ target })` "start start"/"end end" offsets line up exactly
 * with the pin window), the hero's own height here varies (`h-screen` vs an
 * aspect-ratio-driven video height), so instead of measuring progress off
 * the target's own box we measure the wrapper's document offset directly
 * and map raw window scroll position onto it. This keeps the math exact
 * regardless of the hero's own rendered height.
 */
function PinnedCurtain({
  children,
  className,
  label,
}: {
  children: ReactNode;
  className?: string;
  label: string;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const [pinStart, setPinStart] = useState(0);
  const [pinRangePx, setPinRangePx] = useState(1);

  useLayoutEffect(() => {
    const measure = () => {
      const el = wrapperRef.current;
      if (!el) return;
      setPinStart(el.getBoundingClientRect().top + window.scrollY);
      setPinRangePx(Math.max(1, (CURTAIN_VH / 100) * window.innerHeight));
    };

    measure();
    window.addEventListener("resize", measure);
    // Layout can still shift after first paint (fonts swapping in, images
    // resolving their intrinsic size) — a ResizeObserver on the wrapper
    // itself catches those without needing a fixed re-measure delay.
    const observer = new ResizeObserver(measure);
    if (wrapperRef.current) observer.observe(wrapperRef.current);

    return () => {
      window.removeEventListener("resize", measure);
      observer.disconnect();
    };
  }, []);

  // Real-time, bidirectional by construction: this is just scroll position
  // remapped onto [0, 1], so scrolling up unwinds it exactly as it was
  // built, frame by frame — no separate "closing" animation to author.
  const progress = useTransform(
    scrollY,
    [pinStart, pinStart + pinRangePx],
    [0, 1],
    { clamp: true },
  );

  const leftX = useTransform(progress, [0, 1], ["0%", "-100%"]);
  const rightX = useTransform(progress, [0, 1], ["0%", "100%"]);
  const labelY = useTransform(progress, [0, 1], [0, -LABEL_TRAVEL_PX]);

  return (
    <div ref={wrapperRef} className="relative">
      <section className={`sticky top-0 ${className ?? ""}`}>
        {children}

        {/* Curtain overlay — absolutely positioned to the hero's own box
            (not viewport-fixed), so it covers exactly the hero regardless
            of the hero's own height, and stays put while the section is
            stuck. */}
        <div
          className="pointer-events-none absolute inset-0 z-40 overflow-hidden"
          aria-hidden
        >
          <motion.div
            className="absolute inset-y-0 left-0 w-1/2 bg-brand-black"
            style={{ x: leftX, transformOrigin: "top" }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.35, ease: ENTRANCE_EASE }}
          />
          <motion.div
            className="absolute inset-y-0 right-0 w-1/2 bg-brand-black"
            style={{ x: rightX, transformOrigin: "top" }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.35, ease: ENTRANCE_EASE }}
          />
          <div className="absolute inset-0 flex items-center justify-center px-6">
            {/* Entrance: slides the label as one rigid unit from the top
                edge of the box down to its resting center — `-50vh` is
                exactly the distance from center to top, so it starts flush
                with the still-growing box's leading edge and settles right
                as the box finishes growing, same duration/easing as the
                panels' own `scaleY`, so it reads as one motion (the name
                riding down with the curtain), not two separate ones. */}
            <motion.div
              initial={{ y: "-50vh" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.35, ease: ENTRANCE_EASE }}
            >
              {/* Clip box sized to the label itself (not the viewport) —
                  the "invisible line" sits right at its own top edge, so
                  once scrolling starts the label only has to travel about
                  one line height before it's scrolled past that edge and
                  clipped out of view. Separate from the entrance slide
                  above: that one moves this whole (already correctly
                  fitted) box as a rigid unit, so nothing is clipped
                  prematurely while it's sliding into place. */}
              <div className="overflow-hidden">
                <motion.p
                  className="text-center font-display font-black uppercase text-brand-light text-4xl leading-none sm:text-6xl md:text-7xl"
                  style={{ y: labelY }}
                >
                  {label}
                </motion.p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Dedicated scroll budget for the curtain's open/close gesture (see
          CURTAIN_VH above) — lives here as plain extra height in the
          wrapper, not baked into the hero's own sizing, so the hero's
          natural height/aspect-ratio behavior is untouched. */}
      <div aria-hidden style={{ height: `${CURTAIN_VH}vh` }} />
    </div>
  );
}

/**
 * Wraps the hero's own content in a full-screen "curtain" intro: a black
 * panel grows down from the top (page name centered, in white/`brand-light`)
 * then splits open left/right as the visitor scrolls — fully reversible at
 * any point, since it's driven directly off real scroll position rather
 * than a manually-accumulated progress value. The hero's own content sits
 * underneath, inside the same pinned/sticky box, so it's visible (just
 * covered) from the very first frame rather than being pushed down by
 * extra scroll distance.
 *
 * Rendered from `HeroSection` itself (not site-wide layout chrome), so it
 * only ever appears on pages that actually have a hero section — the
 * homepage (which uses its own `SplitVideoReveal` instead) never renders
 * this component at all, no route check needed here.
 */
export function PageIntroCurtain({ children, className }: PageIntroCurtainProps) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const label = getPageLabel(pathname);

  if (reduceMotion) {
    return <section className={`relative ${className ?? ""}`}>{children}</section>;
  }

  return (
    <PinnedCurtain className={className} label={label}>
      {children}
    </PinnedCurtain>
  );
}
