"use client";

import { useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { sanityImageLoader, urlFor } from "@/sanity/lib/image";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type SanityImage = { asset: { _ref: string }; lqip?: string };

type Props = {
  images: SanityImage[];
  title: string;
  /** Currently open photo's index, or `null` when the lightbox is closed. */
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
};

function LightboxDialog({
  images,
  title,
  index,
  onClose,
  onNavigate,
}: Props & { index: number }) {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNavigate((index + 1) % images.length);
      if (e.key === "ArrowLeft") onNavigate((index - 1 + images.length) % images.length);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [index, images, onClose, onNavigate]);

  const image = images[index];

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`${title} — foto ${index + 1} z ${images.length}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-brand-black/95 p-6 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.2 }}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Zavřít"
        className="absolute top-6 right-6 flex h-11 w-11 items-center justify-center rounded-full border border-brand-light/20 text-brand-light transition-colors hover:border-brand-gold hover:text-brand-gold"
      >
        <X size={20} />
      </button>

      {images.length > 1 && (
        <button
          type="button"
          onClick={() => onNavigate((index - 1 + images.length) % images.length)}
          aria-label="Předchozí fotka"
          className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-brand-light/20 text-brand-light transition-colors hover:border-brand-gold hover:text-brand-gold sm:left-8"
        >
          <ChevronLeft size={22} />
        </button>
      )}

      <motion.div
        key={index}
        initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.96 }}
        transition={{ duration: reduceMotion ? 0 : 0.2 }}
        className="relative aspect-4/3 w-full max-w-4xl"
      >
        <Image
          src={urlFor(image).url()}
          loader={sanityImageLoader}
          alt={`${title} — ${index + 1}`}
          fill
          sizes="90vw"
          className="object-contain"
          placeholder={image.lqip ? "blur" : "empty"}
          blurDataURL={image.lqip}
        />
      </motion.div>

      {images.length > 1 && (
        <button
          type="button"
          onClick={() => onNavigate((index + 1) % images.length)}
          aria-label="Další fotka"
          className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-brand-light/20 text-brand-light transition-colors hover:border-brand-gold hover:text-brand-gold sm:right-8"
        >
          <ChevronRight size={22} />
        </button>
      )}

      <p className="absolute bottom-6 left-1/2 -translate-x-1/2 font-body text-sm tracking-widest text-brand-light/60">
        {String(index + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
      </p>
    </motion.div>
  );
}

/**
 * Full-screen photo lightbox with prev/next navigation (click, arrow keys)
 * and Escape-to-close — shared by every clickable photo grid/strip on the
 * case-study pages (BehindTheScenesFilmstrip, OutputGalleryMosaic) so they
 * all open the same overlay instead of each rolling their own.
 */
export function PhotoLightbox({ images, title, index, onClose, onNavigate }: Props) {
  return (
    <AnimatePresence>
      {index !== null && (
        <LightboxDialog
          images={images}
          title={title}
          index={index}
          onClose={onClose}
          onNavigate={onNavigate}
        />
      )}
    </AnimatePresence>
  );
}
