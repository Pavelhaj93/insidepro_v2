"use client";

import { useState } from "react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

type SanityImage = { asset: { _ref: string } };

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

function hasAsset(image?: SanityImage): image is SanityImage & { asset: { _ref: string } } {
  return Boolean(image?.asset?._ref);
}

export function ProjectCard({ project }: Props) {
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

  return (
    <div className="group relative overflow-hidden aspect-4/3 bg-brand-dark rounded-md">
      {images[currentIndex] && (
        <Image
          src={urlFor(images[currentIndex]).width(1200).height(900).url()}
          alt={project.title}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
      )}

      <div className="absolute inset-0 bg-linear-to-t from-brand-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
        {project.client && (
          <p className="font-body text-xs tracking-widest text-brand-gold uppercase mb-1">
            {project.client}
          </p>
        )}
        <h3 className="font-display font-bold text-lg uppercase text-brand-light">
          {project.title}
        </h3>
        {project.excerpt && (
          <p className="font-body text-sm text-brand-light/60 leading-relaxed mt-1">
            {project.excerpt}
          </p>
        )}
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
    </div>
  );
}
