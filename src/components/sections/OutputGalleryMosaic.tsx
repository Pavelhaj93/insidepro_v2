import { urlFor } from "@/sanity/lib/image";
import { SanityImage } from "@/components/ui/SanityImage";
import { SectionMarkerHeading } from "@/components/sections/SectionMarkerHeading";

type SanityImage = { asset: { _ref: string }; lqip?: string };

type Props = {
  images?: SanityImage[];
  title: string;
  /** Offset for generated alt text, so numbering continues after any photos
   * already shown earlier on the page (e.g. the 01/02 text+image sections). */
  startIndex?: number;
  /** When set, renders a "NN / Výsledek" chapter heading above the grid —
   * passed only when this gallery stands in for the result section (i.e.
   * the project has no result video, so these photos ARE the result). When
   * a video result section already exists elsewhere on the page, this is
   * left unset and the grid renders as an unlabeled "more from this
   * project" bonus gallery instead. */
  marker?: string;
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
export function OutputGalleryMosaic({ images, title, startIndex = 0, marker }: Props) {
  if (!images?.length) return null;

  return (
    <section className="pl-6 sm:pl-24 lg:pl-48 pr-6 md:pr-10 lg:pr-24 pb-24">
      <div className="mx-auto max-w-7xl">
        {marker && <SectionMarkerHeading marker={marker} heading="Výsledek" />}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image, index) => {
            const wide = isTileWide(index);

            return (
              <div
                key={index}
                className={`group relative overflow-hidden rounded-4xl bg-brand-dark ${
                  wide ? "lg:col-span-2 aspect-4/3" : "aspect-4/3 lg:aspect-auto lg:h-full"
                }`}
              >
                <SanityImage
                  src={urlFor(image).url()}
                  alt={`${title} — ${startIndex + index + 1}`}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  blurDataURL={image.lqip}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
