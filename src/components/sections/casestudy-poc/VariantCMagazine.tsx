import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { POC_COPY } from "./pocContent";
import type { PocProject, SanityImage } from "./types";
import { getPocImages } from "./utils";
import { PocFullBleedImage } from "./PocFullBleedImage";
import { PocTextBlock } from "./PocTextBlock";
import { PocVideo } from "./PocVideo";

function PairedImage({ image, alt }: { image?: SanityImage; alt: string }) {
  if (!image) return null;

  return (
    <div className="relative aspect-square overflow-hidden rounded-4xl bg-brand-dark">
      <Image
        src={urlFor(image).width(900).height(900).url()}
        alt={alt}
        fill
        sizes="(min-width: 768px) 45vw, 100vw"
        className="object-cover object-center"
      />
    </div>
  );
}

/**
 * Variant C — asymmetric magazine layout: off-center text blocks, a paired
 * two-image row, a client pull-quote, closing full-bleed image, video.
 */
export function VariantCMagazine({ project }: { project: PocProject }) {
  const images = getPocImages(project);
  const [zadani, spoluprace] = POC_COPY.sections;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-16 px-6 py-16 md:gap-24 md:py-24">
      <PocTextBlock {...zadani} align="right" />

      <PocFullBleedImage image={images[0]} alt={`${project.title} — 1`} />

      <PocTextBlock {...spoluprace} align="left" />

      {(images[1] || images[2]) && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <PairedImage image={images[1]} alt={`${project.title} — 2`} />
          <PairedImage image={images[2]} alt={`${project.title} — 3`} />
        </div>
      )}

      <blockquote className="mx-auto max-w-2xl text-center">
        <p className="font-display text-2xl font-bold leading-snug text-brand-light sm:text-3xl">
          “{POC_COPY.quote.bold}”
        </p>
        <p className="mt-4 font-body text-base text-brand-light/70">
          {POC_COPY.quote.regular}
        </p>
      </blockquote>

      <PocFullBleedImage image={images[3]} alt={`${project.title} — 4`} />

      <PocVideo />
    </div>
  );
}
