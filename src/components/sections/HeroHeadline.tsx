"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import {
  PortableText,
  type PortableTextBlock,
  type PortableTextComponents,
} from "next-sanity";
import { useCurtainProgress } from "@/components/motion/PageIntroCurtain";

type Props = {
  headline?: PortableTextBlock[];
  subtitle?: string;
};

const headlineComponents: PortableTextComponents = {
  block: {
    normal: ({ children, index }) =>
      index > 0 ? (
        <>
          <br />
          {children}
        </>
      ) : (
        <>{children}</>
      ),
  },
  marks: {
    gold: ({ children }) => <span className="text-brand-gold">{children}</span>,
    strong: ({ children }) => (
      <strong className="font-extrabold">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
  },
};

// The curtain-progress window over which each piece fades/slides up from
// below — timed to start once the curtain's own label has mostly faded
// (see PageIntroCurtain's LABEL_FADE_END) so one text hands off to the
// other rather than both being visible together. Subtitle trails the
// headline slightly, mirroring the old Reveal stagger (`delay={0.2}`).
const HEADLINE_RANGE: [number, number] = [0.3, 0.65];
const SUBTITLE_RANGE: [number, number] = [0.4, 0.75];

/**
 * The hero's headline/subtitle — split out from `HeroSection` (a server
 * component) into its own client component because it needs
 * `useCurtainProgress()`, which only works below a client boundary. When
 * there's no curtain to hand off from (reduced motion, or none rendered),
 * `useCurtainProgress()` returns null and the fallback motion value below
 * pins both ranges past their end, so everything just renders fully
 * visible/settled with no animation.
 */
export function HeroHeadline({ headline, subtitle }: Props) {
  const curtainProgress = useCurtainProgress();
  const fallback = useMotionValue(1);
  const progress = curtainProgress ?? fallback;

  const headlineOpacity = useTransform(progress, HEADLINE_RANGE, [0, 1], {
    clamp: true,
  });
  const headlineY = useTransform(progress, HEADLINE_RANGE, [32, 0], {
    clamp: true,
  });
  const subtitleOpacity = useTransform(progress, SUBTITLE_RANGE, [0, 1], {
    clamp: true,
  });
  const subtitleY = useTransform(progress, SUBTITLE_RANGE, [24, 0], {
    clamp: true,
  });

  return (
    <>
      {headline && (
        <motion.h1
          style={{ opacity: headlineOpacity, y: headlineY }}
          className="font-display font-black text-[2.5rem] leading-[1.05] sm:text-6xl md:text-7xl lg:text-8xl 2xl:text-9xl tracking-normal uppercase text-brand-light"
        >
          <PortableText value={headline} components={headlineComponents} />
        </motion.h1>
      )}
      {subtitle && (
        <motion.p
          style={{ opacity: subtitleOpacity, y: subtitleY }}
          className="font-display font-medium text-base leading-none tracking-normal uppercase text-brand-light/70 mt-20"
        >
          {subtitle}
        </motion.p>
      )}
    </>
  );
}
