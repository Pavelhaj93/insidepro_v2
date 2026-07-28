"use client";

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

type Props = {
  title?: string;
  logos?: BrandLogo[];
};

// Ensures the loop never shows a visible gap/jump when there are few logos.
const MIN_SLIDES_FOR_SEAMLESS_LOOP = 8;

export function LogoWallSection({ title, logos = [] }: Props) {
  const reduceMotion = useReducedMotion();

  if (!logos?.length) return null;

  const usableLogos = logos.filter(
    (logo): logo is BrandLogo & { image: NonNullable<BrandLogo["image"]> } =>
      Boolean(logo.image),
  );
  const slides =
    usableLogos.length < MIN_SLIDES_FOR_SEAMLESS_LOOP
      ? [...usableLogos, ...usableLogos]
      : usableLogos;

  return (
    <section className="px-4 sm:px-6 lg:px-10 py-20 md:py-28 text-center">
      {title && (
        <h2 className="font-display font-black text-xl sm:text-2xl md:text-3xl lg:text-5xl leading-tight tracking-normal uppercase text-brand-gold mb-12">
          {title}
        </h2>
      )}

      <Carousel
        opts={{ loop: true, align: "start", dragFree: true }}
        plugins={
          reduceMotion
            ? []
            : [
                AutoScroll({
                  direction: "forward",
                  stopOnInteraction: false,
                  stopOnMouseEnter: true,
                  speed: 0.9,
                }),
              ]
        }
        className="w-full mask-[linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
      >
        <CarouselContent className="-ml-14.5 items-center">
          {slides.map((logo, i) => {
            const img = (
              <Image
                src={urlFor(logo.image).height(200).url()}
                alt={logo.name}
                width={220}
                height={80}
                className="h-10 sm:h-12 md:h-14 lg:h-16 w-auto object-contain brightness-0 invert"
              />
            );

            return (
              <CarouselItem
                key={`${logo._id}-${i}`}
                className="pl-32 basis-auto shrink-0 grow-0"
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
    </section>
  );
}
