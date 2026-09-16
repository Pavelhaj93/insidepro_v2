import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

type SanityImage = { asset: { _ref: string } };

type Props = {
  images?: SanityImage[];
  title: string;
  /** Offset for generated alt text, so numbering continues after any photos
   * already shown earlier on the page (e.g. the 01/02 text+image sections). */
  startIndex?: number;
};

// Same alternating wide/narrow pattern as the /reference listing grid
// (see `ReferenceWorksSection.tsx`'s `isProjectWide`): a 3-column grid where
// each row's pair of tiles is 2/3 + 1/3 width, flipping which side is wide
// every row, instead of a plain uniform 2-column grid.
function isTileWide(index: number) {
  const isFirstInPair = index % 2 === 0;
  const rowStartsWide = Math.floor(index / 2) % 2 === 0;
  return isFirstInPair ? rowStartsWide : !rowStartsWide;
}

/**
 * The closing "more from this project" photo grid — matches the alternating
 * wide/narrow tile pattern already used on the /reference listing page,
 * instead of the plain uniform grid this used to be.
 */
export function OutputGalleryMosaic({ images, title, startIndex = 0 }: Props) {
  if (!images?.length) return null;

  return (
    <section className="pl-6 sm:pl-24 lg:pl-48 pr-6 md:pr-10 lg:pr-24 pb-24">
      <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image, index) => {
          const wide = isTileWide(index);

          return (
            <div
              key={index}
              className={`group relative overflow-hidden rounded-4xl bg-brand-dark ${
                wide ? "lg:col-span-2 aspect-4/3" : "aspect-4/3 lg:aspect-auto lg:h-full"
              }`}
            >
              <Image
                src={urlFor(image).width(1200).height(900).url()}
                alt={`${title} — ${startIndex + index + 1}`}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
