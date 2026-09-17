import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { POC_COPY } from "./pocContent";
import type { PocProject } from "./types";
import { getPocImages } from "./utils";
import { PocTextBlock } from "./PocTextBlock";
import { PocVideo } from "./PocVideo";

/**
 * Variant B — carousel centerpiece: intro + collaboration text, one large
 * swipeable embla carousel with every available project image, closing text,
 * video. Reuses the existing embla-based Carousel primitive (already used
 * for the logo wall marquee) instead of a static grid.
 */
export function VariantBCarousel({ project }: { project: PocProject }) {
  const images = getPocImages(project);
  const [zadani, spoluprace, vysledek] = POC_COPY.sections;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-16 px-6 py-16 md:gap-20 md:py-24">
      <PocTextBlock {...zadani} />

      <PocTextBlock {...spoluprace} />

      {images.length > 0 && (
        <Carousel opts={{ loop: true, align: "center" }} className="px-6 md:px-16">
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index} className="basis-4/5 md:basis-3/5">
                <div className="relative aspect-4/3 overflow-hidden rounded-4xl bg-brand-dark">
                  <Image
                    src={urlFor(image).width(1200).height(900).url()}
                    alt={`${project.title} — ${index + 1}`}
                    fill
                    sizes="(min-width: 768px) 60vw, 80vw"
                    className="object-cover object-center"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      )}

      <PocTextBlock {...vysledek} />

      <PocVideo />
    </div>
  );
}
