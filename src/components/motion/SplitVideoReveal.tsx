"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  PortableText,
  type PortableTextBlock,
  type PortableTextComponents,
} from "next-sanity";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useIsMobile } from "@/hooks/useIsMobile";
import { HeroBackgroundVideo } from "@/components/motion/HeroBackgroundVideo";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { BrandButton } from "@/components/ui/BrandButton";

type SplitVideoRevealProps = {
  kicker?: string;
  headline?: PortableTextBlock[];
  subtitle?: string;
  cornerHeadline?: PortableTextBlock[];
  videoSrc: string;
  videoMimeType?: string;
  mobileVideoSrc?: string;
  buttonLabel?: string;
  buttonLink?: string;
  /** Scroll distance (vh) over which the panel/corner slide apart. */
  revealVh?: number;
  /** Extra scroll (vh) to hold the fully-revealed video before the next section can start covering it. */
  holdVh?: number;
  className?: string;
};

const headlineComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <>{children}</>,
  },
  marks: {
    gold: ({ children }) => <span className="text-brand-gold">{children}</span>,
    strong: ({ children }) => (
      <strong className="font-extrabold">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
  },
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
  kicker,
  headline,
  subtitle,
  cornerHeadline,
  videoSrc,
  videoMimeType,
  mobileVideoSrc,
  buttonLabel,
  buttonLink,
  revealVh = 150,
  holdVh = 20,
  className,
}: SplitVideoRevealProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  // Mobile swaps the panel's slide axis (up instead of left) and drops the
  // corner card's own slide entirely — different enough from CSS breakpoint
  // tweaks that it needs a real JS check, not just responsive classes.
  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  // Total wrapper height, and the reveal's *fraction* of it — expressing
  // hold as vh (not a fixed px value) keeps this a pure vh:vh ratio, so it
  // resolves to the same fraction regardless of actual viewport height.
  const totalVh = revealVh + holdVh + HANDOFF_VH;
  const revealEnd = revealVh / totalVh;

  // Whether the next section (ServicesAccordionScroll's `mt-[-100vh]` pull)
  // has fully covered this still-pinned video. Deriving this from
  // scrollYProgress would require knowing exactly how Lenis's smoothed
  // scroll maps to framer's [0,1] range, which doesn't line up cleanly with
  // real pixel positions — checking the actual DOM geometry of whatever
  // sits right after this section is exact and scroll-library-agnostic:
  // once its top edge reaches the top of the viewport, it (being taller
  // than one viewport) necessarily covers the video completely. The video
  // stays geometrically inside the viewport this whole time, so an
  // IntersectionObserver alone can't detect any of this.
  const [covered, setCovered] = useState(false);
  useEffect(() => {
    const next = wrapperRef.current?.nextElementSibling;
    if (!next) return;

    let ticking = false;
    const checkCovered = () => {
      ticking = false;
      setCovered(next.getBoundingClientRect().top <= 0);
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(checkCovered);
    };

    checkCovered();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const panelX = useTransform(scrollYProgress, [0, revealEnd], ["0%", "-100%"]);
  const panelY = useTransform(scrollYProgress, [0, revealEnd], ["0%", "-100%"]);
  const cornerX = useTransform(scrollYProgress, [0, revealEnd], ["0%", "220%"]);
  // Mobile's corner card slides straight down instead of sideways — it's
  // anchored bottom-right, so 100% of its own height is enough to clear it
  // fully past the bottom edge.
  const cornerYMobile = useTransform(
    scrollYProgress,
    [0, revealEnd],
    ["0%", "100%"],
  );
  // Stacks on top of the panel's own -100% shift above, so by the time the
  // panel has fully slid off, the heading has additionally moved this many
  // extra vw further left. Desktop/tablet only — the mobile panel already
  // clears the frame by sliding straight up with the rest of the panel.
  const headingExtraX = useTransform(
    scrollYProgress,
    [0, revealEnd],
    ["0vw", `-${HEADING_EXTRA_VW}vw`],
  );

  const headingClassName =
    "font-display font-black uppercase text-3xl sm:text-6xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-7xl leading-tight mb-5 whitespace-normal sm:whitespace-nowrap";

  if (reduceMotion) {
    return (
      <section className={`relative bg-black ${className ?? ""}`}>
        <div className="relative h-svh w-full overflow-hidden">
          <HeroBackgroundVideo
            src={videoSrc}
            mimeType={videoMimeType}
            mobileSrc={mobileVideoSrc}
          />
          <div className="absolute inset-x-0 bottom-0 z-10 bg-linear-to-t from-black/80 to-transparent p-8 md:p-12">
            <div className="max-w-md ml-4 sm:ml-8">
              {kicker && (
                <p className="font-body text-sm tracking-widest uppercase text-brand-gold mb-4">
                  {kicker}
                </p>
              )}
              {headline && (
                <h1 className={headingClassName}>
                  <PortableText
                    value={headline}
                    components={headlineComponents}
                  />
                </h1>
              )}
              {subtitle && (
                <p className="font-display font-bold uppercase text-lg sm:text-xl leading-snug text-brand-light/80">
                  {subtitle}
                </p>
              )}
              {buttonLabel && buttonLink && (
                <div className="inline-block mt-6">
                  <MagneticButton>
                    <BrandButton href={buttonLink} variant="gold">
                      {buttonLabel}
                    </BrandButton>
                  </MagneticButton>
                </div>
              )}
            </div>
          </div>
          {cornerHeadline && (
            <div className="absolute bottom-8 right-8 z-10 max-w-xs rounded-2xl bg-black/80 p-4 text-right md:bottom-12 md:right-12">
              <h2 className="font-display font-black uppercase text-xl sm:text-3xl leading-tight text-white">
                <PortableText
                  value={cornerHeadline}
                  components={headlineComponents}
                />
              </h2>
            </div>
          )}
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
      <div className="sticky top-0 h-svh w-full overflow-hidden">
        <HeroBackgroundVideo
          src={videoSrc}
          mimeType={videoMimeType}
          mobileSrc={mobileVideoSrc}
          timecodeClassName="pointer-events-none absolute bottom-10 left-4 top-auto right-auto z-20 flex flex-col items-start gap-1.5 rounded-xl bg-black/50 px-3 py-2 backdrop-blur-sm sm:top-4 sm:right-4 sm:bottom-auto sm:left-auto sm:items-end md:top-6 md:right-6"
          forcePause={covered}
        />
        {/* <div className="absolute inset-0 z-0 bg-white" /> */}

        <motion.div
          className="absolute inset-x-0 top-0 z-10 flex h-1/2 w-full items-center overflow-hidden bg-black px-6 pt-20 pb-6 text-white sm:inset-y-0 sm:inset-x-auto sm:left-0 sm:h-auto sm:w-1/2 sm:items-center sm:overflow-visible sm:pt-10 sm:pr-10 sm:pb-10 sm:pl-24 md:w-[52%] md:pt-14 md:pr-14 md:pb-14"
          style={isMobile ? { y: panelY } : { x: panelX }}
        >
          <div className="max-w-md sm:ml-8">
            {kicker && (
              <p className="font-body text-xs tracking-widest uppercase text-brand-gold mb-3 sm:text-sm sm:mb-4">
                {kicker}
              </p>
            )}
            {headline && (
              <motion.h1
                className={headingClassName}
                style={isMobile ? undefined : { x: headingExtraX }}
              >
                <PortableText
                  value={headline}
                  components={headlineComponents}
                />
              </motion.h1>
            )}
            {subtitle && (
              <p className="font-display font-bold uppercase text-sm leading-snug text-brand-light/80 sm:text-xl">
                {subtitle}
              </p>
            )}
            {buttonLabel && buttonLink && (
              <div className="inline-block mt-4 sm:mt-6">
                <MagneticButton>
                  <BrandButton href={buttonLink} variant="gold">
                    {buttonLabel}
                  </BrandButton>
                </MagneticButton>
              </div>
            )}
          </div>
          {/*
            Reverse/"flush" corner: a normal `rounded-br-*` on the panel
            itself would cut a notch OUT of the black box (concave from the
            panel's own side). This instead bulges black OUTWARD into the
            video half — a quarter-disk anchored at the panel's own
            bottom-right corner (bottom-0 left-full puts this patch's
            bottom-left point exactly there), filled solid up to its radius
            and transparent beyond it, via radial-gradient (no CSS utility
            produces an outward-bulging corner, only inward ones). Desktop/
            tablet only — the mobile panel spans full width, so it has no
            side edge for this to bulge into.
          */}
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-8 left-full hidden h-16 w-16 bg-[radial-gradient(circle_at_top_right,transparent_64px,black_65px)] sm:block"
          />
        </motion.div>

        <motion.div
          className="absolute z-10 max-w-[60vw] rounded-tl-4xl bg-black p-4 text-right bottom-4 right-0 sm:max-w-none sm:h-40 sm:bottom-8 sm:right-8 sm:w-100 sm:p-6 md:bottom-0 md:right-0 md:p-8 md:pr-12"
          style={isMobile ? { y: cornerYMobile } : { x: cornerX }}
        >
          {cornerHeadline && (
            <h2 className="font-display font-black uppercase text-base leading-tight text-white sm:text-3xl">
              <PortableText
                value={cornerHeadline}
                components={headlineComponents}
              />
            </h2>
          )}
          {/* Mirror of the panel's flush corner, attached to this box's left edge instead — desktop/tablet only. */}
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-8 right-full hidden h-16 w-16 bg-[radial-gradient(circle_at_top_left,transparent_64px,black_65px)] sm:block"
          />
          {/* Same shape again, rotated 90°: attached to this box's top edge, flush against the screen's right edge — desktop/tablet only. */}
          <div
            aria-hidden
            className="pointer-events-none absolute right-0 bottom-full hidden h-16 w-16 bg-[radial-gradient(circle_at_top_left,transparent_64px,black_65px)] sm:block"
          />
        </motion.div>

        <div className="absolute inset-x-0 bottom-0 z-20 h-8 bg-black" />
      </div>
    </section>
  );
}
