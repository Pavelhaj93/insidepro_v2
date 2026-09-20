import { notFound } from "next/navigation";
import Link from "next/link";
import {
  PortableText,
  type PortableTextBlock,
  type PortableTextComponents,
} from "next-sanity";
import { client } from "@/sanity/lib/client";
import { referenceDetailQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { SanityImage } from "@/components/ui/SanityImage";
import { Badge } from "@/components/ui/Badge";
import { CaseStudyBodySections } from "@/components/sections/CaseStudyBodySections";
import { BehindTheScenesFilmstrip } from "@/components/sections/BehindTheScenesFilmstrip";
import { OutputGalleryMosaic } from "@/components/sections/OutputGalleryMosaic";
import { SectionMarkerHeading } from "@/components/sections/SectionMarkerHeading";
import { ProjectPrevNextNav } from "@/components/sections/ProjectPrevNextNav";
import { GlobeIcon } from "@/components/icons/Globe";
import { parseCaseStudySections } from "@/lib/caseStudyBody";
import { getOrderedReferenceProjects, getAdjacentProjects } from "@/lib/projects";
import { FILM_STATUS_LABELS } from "@/lib/filmStatus";

type Props = {
  params: Promise<{ slug: string }>;
};

type SanityImageT = { asset: { _ref: string }; lqip?: string };

type VideoField = {
  file?: { asset?: { url?: string; mimeType?: string } };
  poster?: SanityImageT;
};

type ReferenceItem = {
  _type: "project" | "film";
  _id: string;
  title: string;
  slug: string;
  client?: string;
  websiteUrl?: string;
  coverImage?: SanityImageT;
  categories?: string[];
  excerpt?: string;
  // Project-only fields — see `parseCaseStudySections` for why `body` isn't
  // typed any more precisely than "blocks with span children".
  body?: { _type: string; children?: { _type: "span"; text?: string; marks?: string[] }[] }[];
  gallery?: SanityImageT[];
  behindTheScenesGallery?: SanityImageT[];
  projectVideos?: VideoField[];
  // Film-only fields (undefined on "project" docs)
  description?: string;
  yearOfProduction?: string;
  director?: string;
  genre?: string;
  country?: string;
  production?: string;
  coproducer?: string;
  partners?: string[];
  status?: string;
  synopsis?: PortableTextBlock[];
  trailerVideo?: VideoField;
};

// Renders `film.synopsis` — the constrained "flowing prose" Portable Text
// shape shared with richTextSection.body (block-only, Strong/Emphasis/Gold
// marks, no lists/annotations), styled for this page's left-aligned
// narrative column rather than RichTextSection's centered black box.
const synopsisComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="font-body text-lg leading-8 text-brand-light/80 mb-6 last:mb-0">
        {children}
      </p>
    ),
  },
  marks: {
    gold: ({ children }) => <span className="text-brand-gold">{children}</span>,
    strong: ({ children }) => <strong className="font-extrabold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
  },
};

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const [item, orderedProjects]: [
    ReferenceItem | null,
    Awaited<ReturnType<typeof getOrderedReferenceProjects>>,
  ] = await Promise.all([
    client.fetch(referenceDetailQuery, { slug }),
    getOrderedReferenceProjects(),
  ]);

  if (!item) notFound();

  const isFilm = item._type === "film";
  const adjacentProjects = getAdjacentProjects(orderedProjects, slug);

  const bodySections = isFilm ? [] : parseCaseStudySections(item.body);
  const leftoverGallery = isFilm
    ? []
    : bodySections.length > 0
      ? (item.gallery ?? []).slice(bodySections.length)
      : (item.gallery ?? []);

  // Chapter numbering after the 01/02 text sections stays sequential even
  // when a project has no behind-the-scenes photos and/or no result video —
  // each optional section only claims a number if it actually renders, so a
  // project missing "Jak to vznikalo" jumps straight to "02 Výsledek"
  // instead of leaving a gap at "02" or hardcoding "03"/"04".
  const hasBehindTheScenes = !isFilm && (item.behindTheScenesGallery?.length ?? 0) > 0;
  const resultVideos = isFilm
    ? []
    : (item.projectVideos ?? []).filter((video) => Boolean(video.file?.asset?.url));
  const hasResultVideo = resultVideos.length > 0;
  const hasResultPhotos = !isFilm && leftoverGallery.length > 0;
  const showResultSection = hasResultVideo || hasResultPhotos;

  const behindTheScenesMarker = String(bodySections.length + 1).padStart(2, "0");
  const resultMarker = String(
    bodySections.length + (hasBehindTheScenes ? 2 : 1),
  ).padStart(2, "0");

  const teaser = isFilm ? item.description : item.excerpt;

  const filmMeta = isFilm
    ? [
        { label: "Rok", value: item.yearOfProduction },
        { label: "Režie", value: item.director },
        { label: "Země", value: item.country },
        { label: "Žánr", value: item.genre },
        { label: "Produkce", value: item.production },
        { label: "Koproducent", value: item.coproducer },
        {
          label: "Status",
          value: item.status ? (FILM_STATUS_LABELS[item.status] ?? item.status) : undefined,
        },
      ].filter((entry): entry is { label: string; value: string } => Boolean(entry.value))
    : [];

  const filmPartners = isFilm ? (item.partners ?? []) : [];
  const hasFilmSynopsis = isFilm && Boolean(item.synopsis?.length);
  const hasFilmTrailer = isFilm && Boolean(item.trailerVideo?.file?.asset?.url);
  const hasFilmGallery = isFilm && (item.gallery?.length ?? 0) > 0;

  // Sequential chapter numbering (01 O filmu / 02 Trailer / 03 Jak to
  // vznikalo) that skips whichever of the three doesn't render, same
  // principle as the project page's body/behind-the-scenes/result markers.
  let filmChapterCount = 0;
  const synopsisMarker = hasFilmSynopsis
    ? String(++filmChapterCount).padStart(2, "0")
    : undefined;
  const trailerMarker = hasFilmTrailer
    ? String(++filmChapterCount).padStart(2, "0")
    : undefined;
  const galleryMarker = hasFilmGallery
    ? String(++filmChapterCount).padStart(2, "0")
    : undefined;

  return (
    <main className="bg-brand-black text-brand-light">
      <section className="relative h-[70vh] min-h-125 w-full overflow-hidden">
        {item.coverImage && (
          <SanityImage
            src={urlFor(item.coverImage).url()}
            alt={item.title}
            sizes="100vw"
            className="object-cover object-center lg:object-[center_30%]"
            priority
            blurDataURL={item.coverImage.lqip}
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-brand-black via-brand-black/50 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 pl-6 sm:pl-24 lg:pl-48 pr-6 md:pr-10 lg:pr-24 pb-10 md:pb-14">
          <div className="mx-auto max-w-7xl flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="max-w-3xl">
              <Link
                href="/reference"
                className="font-body text-sm tracking-widest uppercase text-brand-gold mb-4 inline-flex items-center gap-2 transition-colors hover:text-brand-light"
              >
                ← Reference
              </Link>

              {item.categories && item.categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {item.categories.map((category) => (
                    <Badge key={category}>{category}</Badge>
                  ))}
                </div>
              )}

              <h1 className="font-display font-black uppercase text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-none text-brand-light">
                {item.title}
              </h1>

              {teaser && (
                <p className="font-body text-lg sm:text-xl leading-8 text-brand-light/80 mt-4 max-w-2xl">
                  {teaser}
                </p>
              )}
            </div>

            {item.websiteUrl && (
              <a
                href={item.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center gap-2 font-display font-medium text-sm sm:text-base uppercase tracking-wide text-brand-gold hover:text-brand-light transition-colors"
              >
                <GlobeIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                Navštívit web
              </a>
            )}
          </div>
        </div>
      </section>

      {isFilm && (filmMeta.length > 0 || hasFilmSynopsis || filmPartners.length > 0) && (
        <section className="pl-6 sm:pl-24 lg:pl-48 pr-6 md:pr-10 lg:pr-24 py-16 md:py-24">
          <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-12 items-start">
            <div className="flex flex-col gap-12 md:gap-16 max-w-2xl">
              {hasFilmSynopsis && (
                <div>
                  <SectionMarkerHeading marker={synopsisMarker!} heading="O filmu" />
                  <PortableText value={item.synopsis!} components={synopsisComponents} />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-6 lg:sticky lg:top-32">
              {filmMeta.length > 0 && (
                <dl className="grid grid-cols-2 gap-x-6 gap-y-6">
                  {filmMeta.map((entry) => (
                    <div key={entry.label}>
                      <dt className="font-body text-xs tracking-widest uppercase text-brand-gold mb-1">
                        {entry.label}
                      </dt>
                      <dd className="font-display font-bold text-brand-light">
                        {entry.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}

              {filmPartners.length > 0 && (
                <div>
                  <p className="font-body text-xs tracking-widest uppercase text-brand-gold mb-2">
                    Partneři projektu
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {filmPartners.map((partner) => (
                      <Badge key={partner}>{partner}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {!isFilm && bodySections.length > 0 && (
        <CaseStudyBodySections
          sections={bodySections}
          gallery={item.gallery}
          title={item.title}
        />
      )}

      {!isFilm && hasBehindTheScenes && (
        <BehindTheScenesFilmstrip
          images={item.behindTheScenesGallery}
          title={item.title}
          marker={behindTheScenesMarker}
        />
      )}

      {hasResultVideo && (
        <section className="pl-6 sm:pl-24 lg:pl-48 pr-6 md:pr-10 lg:pr-24 pb-16 md:pb-24">
          <div className="mx-auto max-w-7xl">
            <SectionMarkerHeading marker={resultMarker} heading="Výsledek" />
            <div className="flex flex-col gap-6 md:gap-8">
              {resultVideos.map((video, index) => (
                <video
                  key={index}
                  src={video.file!.asset!.url}
                  poster={video.poster ? urlFor(video.poster).width(1920).url() : undefined}
                  controls
                  playsInline
                  className="aspect-video w-full rounded-4xl bg-brand-dark"
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {hasFilmTrailer && (
        <section className="pl-6 sm:pl-24 lg:pl-48 pr-6 md:pr-10 lg:pr-24 pb-16 md:pb-24">
          <div className="mx-auto max-w-7xl">
            <SectionMarkerHeading marker={trailerMarker!} heading="Trailer" />
            <video
              src={item.trailerVideo!.file!.asset!.url}
              poster={
                item.trailerVideo?.poster
                  ? urlFor(item.trailerVideo.poster).width(1920).url()
                  : undefined
              }
              controls
              playsInline
              className="aspect-video w-full rounded-4xl bg-brand-dark"
            />
          </div>
        </section>
      )}

      {isFilm ? (
        hasFilmGallery && (
          <OutputGalleryMosaic
            images={item.gallery}
            title={item.title}
            heading="Jak to vznikalo"
            marker={galleryMarker}
          />
        )
      ) : (
        <OutputGalleryMosaic
          images={leftoverGallery}
          title={item.title}
          startIndex={bodySections.length}
          marker={!hasResultVideo && showResultSection ? resultMarker : undefined}
        />
      )}

      {adjacentProjects && (
        <ProjectPrevNextNav prev={adjacentProjects.prev} next={adjacentProjects.next} />
      )}
    </main>
  );
}
