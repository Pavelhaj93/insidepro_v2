"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { HeroBackgroundVideo } from "@/components/motion/HeroBackgroundVideo";

type SplitVideoRevealProps = {
  videoSrc: string;
  videoMimeType?: string;
  mobileVideoSrc?: string;
  /** Small kicker line above the heading, on the panel. */
  panelKicker: ReactNode;
  /** Inline content for the panel's heading (the `<h1>` itself lives here, so it can carry its own scroll speed). */
  panelHeading: ReactNode;
  /** Line below the heading, on the panel. */
  panelSubtitle: ReactNode;
  /** Small floating headline pinned to the bottom-right, over the video. */
  cornerContent: ReactNode;
  /** Scroll distance (vh) over which the panel/corner slide apart. */
  revealVh?: number;
  /** Extra scroll (vh) to hold the fully-revealed video before the next section can start covering it. */
  holdVh?: number;
  className?: string;
};

// How much further (in vw) the heading travels than the rest of the panel
// during the reveal — on narrower/tablet widths the heading text is wide
// enough to overlap the video, so it needs a head start clearing the frame
// rather than sliding out at exactly the same rate as the kicker/subtitle.
const HEADING_EXTRA_VW = 20;

// Reserved scroll budget (2 viewport-heights) for the handoff to whatever
// section follows: it slides up over this still-pinned video via its own
// `margin-top: -100vh` + higher z-index (see ServicesAccordion). That trick
// only reads correctly if the video stays pinned for exactly this long after
// the hold ends — see the height/effectiveRevealEnd math below.
const HANDOFF_VH = 200;

/**
 * Pins a full-bleed background video. A full-height black panel covers
 * roughly the left half (with a scooped, rounded corner where it meets the
 * video) and a small headline, on its own dark backing, floats over the
 * bottom-right of the video. A white stripe stays pinned along the very
 * bottom edge at all times, spanning the full width, unaffected by scroll.
 * As the user scrolls, the two panel pieces slide apart over `revealVh`,
 * then hold fully revealed for `holdVh` more, then stay pinned (unmoving)
 * through a further `HANDOFF_VH` while the next section slides up to cover
 * it — see `ServicesAccordion`'s negative-margin overlap for the other half
 * of that handoff.
 */
export function SplitVideoReveal({
  videoSrc,
  videoMimeType,
  mobileVideoSrc,
  panelKicker,
  panelHeading,
  panelSubtitle,
  cornerContent,
  revealVh = 150,
  holdVh = 20,
  className,
}: SplitVideoRevealProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  // Total wrapper height, and the reveal's *fraction* of it — expressing
  // hold as vh (not a fixed px value) keeps this a pure vh:vh ratio, so it
  // resolves to the same fraction regardless of actual viewport height.
  const totalVh = revealVh + holdVh + HANDOFF_VH;
  const revealEnd = revealVh / totalVh;

  const panelX = useTransform(scrollYProgress, [0, revealEnd], ["0%", "-100%"]);
  const cornerX = useTransform(scrollYProgress, [0, revealEnd], ["0%", "220%"]);
  // Stacks on top of the panel's own -100% shift above, so by the time the
  // panel has fully slid off, the heading has additionally moved this many
  // extra vw further left.
  const headingExtraX = useTransform(
    scrollYProgress,
    [0, revealEnd],
    ["0vw", `-${HEADING_EXTRA_VW}vw`],
  );

  const headingClassName =
    "font-display font-black uppercase text-6xl sm:text-7xl lg:text-8xl leading-tight mb-5 whitespace-nowrap";

  if (reduceMotion) {
    return (
      <section className={`relative bg-black ${className ?? ""}`}>
        <div className="relative h-screen w-full overflow-hidden">
          <HeroBackgroundVideo
            src={videoSrc}
            mimeType={videoMimeType}
            mobileSrc={mobileVideoSrc}
          />
          <div className="absolute inset-x-0 bottom-0 z-10 bg-linear-to-t from-black/80 to-transparent p-8 md:p-12">
            <div className="max-w-md ml-4 sm:ml-8">
              {panelKicker}
              <h1 className={headingClassName}>{panelHeading}</h1>
              {panelSubtitle}
            </div>
          </div>
          <div className="absolute bottom-8 right-8 z-10 max-w-xs rounded-2xl bg-black/80 p-4 text-right md:bottom-12 md:right-12">
            {cornerContent}
          </div>
          <div className="absolute inset-x-0 bottom-0 z-20 h-14 bg-black" />
        </div>
      </section>
    );
  }

  return (
    <section
      ref={wrapperRef}
      className={`bg-black ${className ?? ""}`}
      style={{ height: `${totalVh}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <HeroBackgroundVideo
          src={videoSrc}
          mimeType={videoMimeType}
          mobileSrc={mobileVideoSrc}
        />
        {/* <div className="absolute inset-0 z-0 bg-white" /> */}

        <motion.div
          className="absolute inset-y-0 left-0 z-10 flex w-1/2 items-center bg-black pt-10 pr-10 pb-10 pl-24 text-white md:w-[52%] md:pt-14 md:pr-14 md:pb-14"
          style={{ x: panelX }}
        >
          <div className="max-w-md ml-4 sm:ml-8">
            {panelKicker}
            <motion.h1
              className={headingClassName}
              style={{ x: headingExtraX }}
            >
              {panelHeading}
            </motion.h1>
            {panelSubtitle}
          </div>
          {/*
            Reverse/"flush" corner: a normal `rounded-br-*` on the panel
            itself would cut a notch OUT of the black box (concave from the
            panel's own side). This instead bulges black OUTWARD into the
            video half — a quarter-disk anchored at the panel's own
            bottom-right corner (bottom-0 left-full puts this patch's
            bottom-left point exactly there), filled solid up to its radius
            and transparent beyond it, via radial-gradient (no CSS utility
            produces an outward-bulging corner, only inward ones).
          */}
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-8 left-full h-16 w-16 bg-[radial-gradient(circle_at_top_right,transparent_64px,black_65px)]"
          />
        </motion.div>

        <motion.div
          className="absolute h-40 bottom-8 right-8 z-10 w-100 rounded-tl-4xl bg-black p-6 text-right md:bottom-0 md:right-0 md:p-8 md:pr-12"
          style={{ x: cornerX }}
        >
          {cornerContent}
          {/* Mirror of the panel's flush corner, attached to this box's left edge instead. */}
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-8 right-full h-16 w-16 bg-[radial-gradient(circle_at_top_left,transparent_64px,black_65px)]"
          />
          {/* Same shape again, rotated 90°: attached to this box's top edge, flush against the screen's right edge. */}
          <div
            aria-hidden
            className="pointer-events-none absolute right-0 bottom-full h-16 w-16 bg-[radial-gradient(circle_at_top_left,transparent_64px,black_65px)]"
          />
        </motion.div>

        <div className="absolute inset-x-0 bottom-0 z-20 h-8 bg-black" />
      </div>
    </section>
  );
}
