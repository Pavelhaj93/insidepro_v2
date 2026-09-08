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

const SECONDS_PER_LOGO = 2.5;

/**
 * Simple, continuously auto-scrolling logo strip — deliberately NOT
 * scroll-linked (replaces the scroll-scrubbed `ClientShowcaseHorizontal`,
 * which turned out fragile/prone to getting visually stuck depending on
 * scroll speed and pin timing). A CSS keyframe animation just slides a
 * doubled-up track left on a timer; no scroll math, no pin, nothing that
 * can desync from the user's scroll gesture.
 */
export function LogoCarousel({ logos }: Props) {
  const reduceMotion = useReducedMotion();
  const withImages = (logos ?? []).filter(
    (logo): logo is BrandLogo & { image: NonNullable<BrandLogo["image"]> } =>
      Boolean(logo.image),
  );

  if (!withImages.length) return null;

  const duration = withImages.length * SECONDS_PER_LOGO;
  const track = reduceMotion ? withImages : [...withImages, ...withImages];

  return (
    <section className="overflow-hidden bg-brand-black py-16 pl-24 lg:pl-48 pr-6 md:py-20 md:pr-10 lg:pr-24">
      <div className="mx-auto max-w-7xl overflow-hidden">
        <p className="mb-10 font-display font-bold uppercase text-lg sm:text-xl leading-snug text-brand-light/80">
          Spolupracujeme s nadnárodními i lokálními společnostmi
        </p>

        <div className="mask-[linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div
            className={`flex items-center gap-16 ${
              reduceMotion ? "flex-wrap" : "w-max animate-marquee"
            }`}
            style={
              reduceMotion
                ? undefined
                : ({ "--marquee-duration": `${duration}s` } as CSSProperties)
            }
          >
            {track.map((logo, index) => (
              <div
                key={`${logo._id}-${index}`}
                className="relative h-12 w-32 shrink-0 opacity-60 grayscale transition-opacity duration-300 hover:opacity-100 hover:grayscale-0 md:h-14 md:w-40"
              >
                <Image
                  src={urlFor(logo.image).height(200).url()}
                  alt={logo.name}
                  fill
                  sizes="160px"
                  className="object-contain object-center brightness-0 invert"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
