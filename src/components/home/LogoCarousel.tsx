"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// Matches LogoWallSection.tsx's `BrandLogo` — same `brandLogo` documents,
// referenced from the homepage's `logoWallSection` block. This is the only
// place in this dataset that actually has populated logo images;
// `clientsSection.clients[]` (used elsewhere on this POC page) never got
// real images, only names.
type BrandLogo = {
  _id: string;
  name: string;
  image?: { asset: { _ref: string } };
  url?: string;
};

type Props = {
  logos?: BrandLogo[] | null;
};

type LogoWithImage = BrandLogo & { image: NonNullable<BrandLogo["image"]> };

const SECONDS_PER_LOGO = 4;

/**
 * Simple, continuously auto-scrolling logo strip — deliberately NOT
 * scroll-linked (replaces the scroll-scrubbed `ClientShowcaseHorizontal`,
 * which turned out fragile/prone to getting visually stuck depending on
 * scroll speed and pin timing). A CSS keyframe animation just slides a
 * doubled-up track left on a timer; no scroll math, no pin, nothing that
 * can desync from the user's scroll gesture.
 *
 * Rendered as two stacked rows, each its own half of the logo list: the
 * second row uses a dedicated mirrored keyframe (`.animate-marquee-reverse`,
 * see globals.css) so it drifts the opposite way from the row above it.
 */
export function LogoCarousel({ logos }: Props) {
  const reduceMotion = useReducedMotion();
  const withImages = (logos ?? []).filter(
    (logo): logo is LogoWithImage => Boolean(logo.image),
  );

  if (!withImages.length) return null;

  // Two independent rows drifting opposite ways — each gets its own half of
  // the logos (not the same set twice), so the two rows actually show
  // different content rather than mirroring each other.
  const half = Math.ceil(withImages.length / 2);
  const rowLogos: [LogoWithImage[], LogoWithImage[]] = [
    withImages.slice(0, half),
    withImages.length > half ? withImages.slice(half) : withImages.slice(0, half),
  ];

  const renderRow = (logos: LogoWithImage[], direction: "forward" | "reverse") => {
    const duration = logos.length * SECONDS_PER_LOGO;
    const track = reduceMotion ? logos : [...logos, ...logos];

    return (
      <div className="mask-[linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div
          className={`flex items-center gap-16 ${
            reduceMotion
              ? "flex-wrap"
              : `w-max ${
                  direction === "reverse"
                    ? "animate-marquee-reverse"
                    : "animate-marquee"
                }`
          }`}
          style={
            reduceMotion
              ? undefined
              : ({ "--marquee-duration": `${duration}s` } as CSSProperties)
          }
        >
          {track.map((logo, index) => (
            <div
              key={`${direction}-${logo._id}-${index}`}
              className="relative h-9 w-24 shrink-0 opacity-60 grayscale transition-opacity duration-300 hover:opacity-100 hover:grayscale-0 md:h-10 md:w-28"
            >
              <Image
                src={urlFor(logo.image).height(200).url()}
                alt={logo.name}
                fill
                sizes="112px"
                className="object-contain object-center brightness-0 invert"
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <section className="overflow-hidden bg-brand-black py-16 pl-24 lg:pl-48 pr-6 md:py-20 md:pr-10 lg:pr-24">
      <div className="mx-auto max-w-7xl overflow-hidden">
        <p className="mb-10 font-display font-bold uppercase text-lg sm:text-xl leading-snug text-brand-light/80">
          SPOLUPRACUJEME SE ZNAČKAMI NAPŘÍČ RŮZNÝMI OBORY
        </p>

        <div className="flex flex-col gap-8 md:gap-10">
          {renderRow(rowLogos[0], "forward")}
          {renderRow(rowLogos[1], "reverse")}
        </div>
      </div>
    </section>
  );
}
