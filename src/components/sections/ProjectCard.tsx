"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { sanityImageLoader, urlFor } from "@/sanity/lib/image";

type SanityImage = { asset: { _ref: string }; lqip?: string };

type Project = {
  _id: string;
  title: string;
  client?: string;
  slug: { current: string };
  coverImage?: SanityImage;
  gallery?: SanityImage[];
  category?: string;
  excerpt?: string;
};

type Props = {
  project: Project;
  /**
   * Sizing classes for the image wrapper — defaults to a fixed 4:3 ratio.
   * Override to stretch instead (e.g. "aspect-4/3 lg:aspect-auto lg:h-full")
   * when a narrower grid-span sibling needs to match a wider one's height
   * rather than keep the same aspect ratio at a smaller width.
   */
  aspectClassName?: string;
  /**
   * `next/image` `sizes` for the cover photo — defaults to a plain 2-column
   * grid (`FeaturedWorksSection`). Override when the caller's grid varies a
   * card's real rendered width (e.g. `ReferenceWorksSection`'s alternating
   * wide/narrow 3-column layout), so the CDN is asked for a resolution that
   * actually matches what's on screen.
   */
  sizes?: string;
};

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d={direction === "left" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function hasAsset(
  image?: SanityImage,
): image is SanityImage & { asset: { _ref: string } } {
  return Boolean(image?.asset?._ref);
}

// These projects have no case-study page worth linking to yet — the card
// still shows in the grid, it just isn't clickable/navigable.
const NON_LINKABLE_SLUGS = new Set(["malva", "nad-obal"]);

export function ProjectCard({
  project,
  aspectClassName = "aspect-4/3",
  sizes = "(min-width: 768px) 50vw, 100vw",
}: Props) {
  const isLinkable = !NON_LINKABLE_SLUGS.has(project.slug.current);
  const gallery = project.gallery?.filter(hasAsset) ?? [];
  const images = gallery.length
    ? gallery
    : hasAsset(project.coverImage)
      ? [project.coverImage]
      : [];

  const [currentIndex, setCurrentIndex] = useState(0);

  const showPrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((i) => (i + images.length - 1) % images.length);
  };

  const showNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((i) => (i + 1) % images.length);
  };

  const className = `group relative block overflow-hidden ${aspectClassName} bg-brand-dark rounded-4xl`;

  const cardContent = (
    <>
      {images[currentIndex] && (
        <Image
          src={urlFor(images[currentIndex]).url()}
          loader={sanityImageLoader}
          alt={project.title}
          fill
          sizes={sizes}
          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
          placeholder={images[currentIndex].lqip ? "blur" : "empty"}
          blurDataURL={images[currentIndex].lqip}
        />
      )}

      {/* Always-on scrim (not hover-gated) so the title stays readable over
          any cover image, not just on hover. */}
      <div className="absolute inset-x-0 bottom-0 h-[35%] bg-linear-to-t from-brand-black/80 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-5">
        <div className="grid grid-rows-[auto_0fr] group-hover:grid-rows-[auto_1fr] transition-[grid-template-rows] duration-300 ease-out">
          <h3 className="font-display font-bold text-lg uppercase text-brand-light">
            {project.title}
          </h3>
          {project.excerpt && (
            <div className="overflow-hidden">
              <p className="font-body text-sm text-brand-light/60 leading-relaxed pt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {project.excerpt}
              </p>
            </div>
          )}
        </div>
      </div>

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={showPrev}
            aria-label="Previous image"
            className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9 rounded-full bg-brand-black/50 text-brand-light opacity-0 group-hover:opacity-100 hover:text-brand-gold transition-opacity duration-300"
          >
            <ArrowIcon direction="left" />
          </button>
          <button
            type="button"
            onClick={showNext}
            aria-label="Next image"
            className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9 rounded-full bg-brand-black/50 text-brand-light opacity-0 group-hover:opacity-100 hover:text-brand-gold transition-opacity duration-300"
          >
            <ArrowIcon direction="right" />
          </button>
          <span className="absolute top-3 right-3 font-body text-xs text-brand-light/70 bg-brand-black/50 px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {currentIndex + 1} / {images.length}
          </span>
        </>
      )}
    </>
  );

  if (!isLinkable) {
    return <div className={className}>{cardContent}</div>;
  }

  return (
    <Link href={`/reference/${project.slug.current}`} className={className}>
      {cardContent}
    </Link>
  );
}
