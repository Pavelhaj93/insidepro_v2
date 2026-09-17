"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import AutoScroll from "embla-carousel-auto-scroll";
import { sanityImageLoader, urlFor } from "@/sanity/lib/image";
import {
  HorizontalScrollCards,
  type HorizontalCardRenderArgs,
} from "@/components/motion/HorizontalScrollCards";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { SectionMarkerHeading } from "@/components/sections/SectionMarkerHeading";

type SanityImage = { asset: { _ref: string }; lqip?: string };

type Props = {
  images?: SanityImage[];
  title: string;
};

const PERFORATIONS = Array.from({ length: 8 });

function Perforations() {
  return (
    <div className="flex justify-center gap-2">
      {PERFORATIONS.map((_, i) => (
        <span key={i} className="h-1.5 w-3 rounded-xs bg-brand-light/15" />
      ))}
    </div>
  );
}

/** The film-cell visuals shared by the desktop scroll-scrubbed track and the
 * mobile static strip — perforated top/bottom edges, the photo, and a
 * "03/12" frame number burned into the corner. */
function FilmFrameVisual({
  image,
  index,
  total,
  title,
}: {
  image: SanityImage;
  index: number;
  total: number;
  title: string;
}) {
  return (
    <div className="rounded-2xl border border-brand-light/10 bg-brand-black/60 p-2 shadow-xl shadow-black/40 transition-colors group-hover:border-brand-gold/40">
      <div className="pb-2">
        <Perforations />
      </div>

      <div className="relative aspect-4/3 overflow-hidden rounded-lg bg-brand-dark">
        <Image
          src={urlFor(image).url()}
          loader={sanityImageLoader}
          alt={`${title} — zákulisí ${index + 1}`}
          fill
          sizes="(min-width: 640px) 28vw, 70vw"
          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
          placeholder={image.lqip ? "blur" : "empty"}
          blurDataURL={image.lqip}
        />
        <span className="absolute bottom-2 right-3 font-display text-xs tracking-widest text-brand-light/60">
          {String(index + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}
        </span>
      </div>

      <div className="pt-2">
        <Perforations />
      </div>
    </div>
  );
}

function FilmFrame({
  item,
  index,
  total,
  depthScale,
  depthOpacity,
  title,
  onOpen,
}: HorizontalCardRenderArgs<SanityImage> & {
  title: string;
  onOpen: (index: number) => void;
}) {
  const rotation = index % 2 === 0 ? -1.5 : 1.5;

  return (
    <motion.button
      type="button"
      onClick={() => onOpen(index)}
      style={{ scale: depthScale, opacity: depthOpacity, rotate: rotation }}
      whileHover={{ rotate: 0, scale: 1.03 }}
      className="group block w-full cursor-pointer text-left"
      aria-label={`Zobrazit fotku ${index + 1} z ${total} na celou obrazovku`}
    >
      <FilmFrameVisual image={item} index={index} total={total} title={title} />
    </motion.button>
  );
}

function Lightbox({
  images,
  title,
  index,
  onClose,
  onNavigate,
}: {
  images: SanityImage[];
  title: string;
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
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
      aria-label={`${title} — zákulisí, fotka ${index + 1} z ${images.length}`}
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
          alt={`${title} — zákulisí ${index + 1}`}
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
 * "Behind the scenes" production-photo gallery for the case-study page —
 * a physical-filmstrip-styled reel that scrubs horizontally as the page is
 * scrolled (built on the existing `HorizontalScrollCards` scroll-pin
 * primitive, same as the homepage's `ClientShowcaseHorizontal`), and opens
 * a full-screen lightbox on click.
 */
export function BehindTheScenesFilmstrip({ images, title }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const reduceMotion = useReducedMotion();

  // A continuously auto-scrolling, still-swipeable carousel (same
  // embla-carousel-auto-scroll plugin as LogoWallSection): dragging pauses
  // it and it resumes on its own once the drag settles. The lightbox is a
  // full-screen opaque overlay, so the strip drifting on underneath while
  // it's open is never visible — no need to also pause it for that.
  const mobileOpts = useMemo(() => ({ loop: true, align: "center" as const }), []);
  const mobilePlugins = useMemo(
    () =>
      reduceMotion
        ? []
        : [AutoScroll({ speed: 0.6, stopOnInteraction: false })],
    [reduceMotion],
  );

  if (!images?.length) return null;

  const heading = (
    <div className="max-w-7xl mx-auto">
      <SectionMarkerHeading marker="03" heading="Jak to vznikalo" className="mb-0" />
    </div>
  );

  return (
    <>
      <section className="bg-brand-black px-6 py-16 sm:hidden">
        <SectionMarkerHeading marker="03" heading="Jak to vznikalo" className="mb-10" />
        <Carousel
          opts={mobileOpts}
          plugins={mobilePlugins}
        >
          <CarouselContent className="-ml-4">
            {images.map((image, index) => (
              <CarouselItem key={index} className="basis-4/5 pl-4">
                <button
                  type="button"
                  onClick={() => setOpenIndex(index)}
                  className="group block w-full cursor-pointer text-left"
                  aria-label={`Zobrazit fotku ${index + 1} z ${images.length} na celou obrazovku`}
                >
                  <FilmFrameVisual
                    image={image}
                    index={index}
                    total={images.length}
                    title={title}
                  />
                </button>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </section>

      <div className="hidden sm:block">
        <HorizontalScrollCards
          items={images}
          itemKey={(image, index) => image.asset._ref || String(index)}
          itemWidthVw={28}
          gapVw={3}
          sidebarOffsetPx={96}
          className="bg-brand-black"
          labelClassName="pr-6 md:pr-10 lg:pr-24 lg:pl-24"
          label={heading}
          renderItem={(args) => (
            <FilmFrame {...args} title={title} onOpen={setOpenIndex} />
          )}
        />
      </div>

      <AnimatePresence>
        {openIndex !== null && (
          <Lightbox
            images={images}
            title={title}
            index={openIndex}
            onClose={() => setOpenIndex(null)}
            onNavigate={setOpenIndex}
          />
        )}
      </AnimatePresence>
    </>
  );
}
