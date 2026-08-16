"use client";

import { useMemo } from "react";
import Image from "next/image";
import AutoScroll from "embla-carousel-auto-scroll";
import { urlFor } from "@/sanity/lib/image";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

type BrandLogo = {
  _id: string;
  name: string;
  image?: { asset: { _ref: string } };
  url?: string;
};

type UsableLogo = BrandLogo & { image: NonNullable<BrandLogo["image"]> };

type Props = {
  title?: string;
  logos?: BrandLogo[];
};

// Ensures the loop never shows a visible gap/jump when a row has few logos.
const MIN_SLIDES_FOR_SEAMLESS_LOOP = 8;
const ROW_COUNT = 3;

/** Repeats the row's logos enough times to comfortably fill a seamless loop. */
function buildRowSlides(rowLogos: UsableLogo[]) {
  if (!rowLogos.length) return [];
  const repeats = Math.max(
    1,
    Math.ceil(MIN_SLIDES_FOR_SEAMLESS_LOOP / rowLogos.length),
  );
  return Array.from({ length: repeats }, () => rowLogos).flat();
}

/** Splits `items` into `parts` contiguous, roughly-equal chunks. */
function chunkEvenly<T>(items: T[], parts: number): T[][] {
  const size = Math.ceil(items.length / parts);
  return Array.from({ length: parts }, (_, i) =>
    items.slice(i * size, i * size + size),
  );
}

function LogoWallRow({
  logos,
  direction,
  reduceMotion,
}: {
  logos: UsableLogo[];
  direction: "forward" | "backward";
  reduceMotion: boolean;
}) {
  const slides = useMemo(() => buildRowSlides(logos), [logos]);

  // embla-carousel-react reinitializes (and resets plugin state) whenever
  // `opts`/`plugins` get a new reference, so these must stay stable across
  // re-renders — otherwise AutoScroll's position/timer keeps resetting,
  // which is what caused the jumpy/stuttering autoplay.
  //
  // This is a passive marquee with zero user interruption by design:
  // `watchDrag: false` disables embla's pointer/drag handling entirely (no
  // click-drag pause), and the AutoScroll options below turn off every other
  // built-in "stop" trigger (hover, focus-in, generic interaction) so it just
  // plays continuously no matter what the user does on the page.
  const opts = useMemo(
    () => ({ loop: true, align: "start" as const, watchDrag: false }),
    [],
  );

  const plugins = useMemo(
    () =>
      reduceMotion
        ? []
        : [
            AutoScroll({
              direction,
              stopOnInteraction: false,
              stopOnMouseEnter: false,
              stopOnFocusIn: false,
              speed: 0.5,
            }),
          ],
    [reduceMotion, direction],
  );

  if (!slides.length) return null;

  return (
    <Carousel
      opts={opts}
      plugins={plugins}
      className="w-full mask-[linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
    >
      <CarouselContent className="-ml-10 items-center">
        {slides.map((logo, i) => {
          const img = (
            <Image
              src={urlFor(logo.image).height(200).url()}
              alt={logo.name}
              width={160}
              height={60}
              className="h-6 sm:h-7 md:h-8 lg:h-9 w-auto object-contain brightness-0 invert"
            />
          );

          return (
            <CarouselItem
              key={`${logo._id}-${i}`}
              className="pl-10 basis-auto shrink-0 grow-0"
            >
              {logo.url ? (
                <a
                  href={logo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={logo.name}
                  className="opacity-90 hover:opacity-50 transition-opacity"
                >
                  {img}
                </a>
              ) : (
                <span className="opacity-90">{img}</span>
              )}
            </CarouselItem>
          );
        })}
      </CarouselContent>
    </Carousel>
  );
}

export function LogoWallSection({ title, logos = [] }: Props) {
  const reduceMotion = useReducedMotion();

  const usableLogos = useMemo(
    () => logos.filter((logo): logo is UsableLogo => Boolean(logo.image)),
    [logos],
  );

  const rows = useMemo(
    () => chunkEvenly(usableLogos, ROW_COUNT).filter((row) => row.length),
    [usableLogos],
  );

  if (!usableLogos.length) return null;

  return (
    <section className="px-4 sm:px-6 lg:px-10 py-20 md:py-28 text-center">
      {title && (
        <h2 className="font-display font-black text-xl sm:text-2xl md:text-3xl lg:text-5xl leading-tight tracking-normal uppercase text-brand-gold mb-12">
          {title}
        </h2>
      )}

      <div className="max-w-7xl mx-auto flex flex-col gap-8 md:gap-10">
        {rows.map((rowLogos, rowIndex) => (
          <LogoWallRow
            key={rowIndex}
            logos={rowLogos}
            direction={rowIndex % 2 === 0 ? "forward" : "backward"}
            reduceMotion={reduceMotion}
          />
        ))}
      </div>
    </section>
  );
}
