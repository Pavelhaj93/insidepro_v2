"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { urlFor, sanityImageLoader } from "@/sanity/lib/image";
import {
  HorizontalScrollCards,
  type HorizontalCardRenderArgs,
} from "@/components/motion/HorizontalScrollCards";

type SanityImage = { asset: { _ref: string } };

type ClientItem = {
  name: string;
  tagline?: string;
  url?: string;
  logo?: SanityImage;
  backgroundImage?: SanityImage; // asset._ref may also be a raw https:// URL (mocks)
  slug?: string; // only set for entries backed by a real `project` reference
  // Only set for entries backed by a real `project` reference — a
  // dereferenced `video` library document (see `project.hoverVideo` in the
  // Studio schema). Plays over the card's image on hover, desktop/tablet
  // only (see ClientCard below).
  hoverVideo?: { file?: { asset?: { url?: string; mimeType?: string } } };
};

type Props = {
  clients?: ClientItem[] | null;
};

// Same fallback as ClientsShowcaseSection: mock entries store a plain URL in
// `asset._ref` instead of a real Sanity reference.
function resolveImageUrl(img: SanityImage): string {
  const ref = img.asset._ref;
  if (ref.startsWith("http")) {
    const url = new URL(ref);
    url.search = "";
    return url.toString();
  }
  return urlFor(img).url();
}

function ClientCard({
  item,
  index,
  depthScale,
  depthOpacity,
}: HorizontalCardRenderArgs<ClientItem>) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hoverVideoUrl = item.hoverVideo?.file?.asset?.url;

  const image = (
    <div className="relative aspect-4/3 w-full overflow-hidden rounded-3xl bg-brand-dark">
      {item.backgroundImage ? (
        <Image
          src={resolveImageUrl(item.backgroundImage)}
          loader={sanityImageLoader}
          alt={item.name}
          fill
          sizes="38vw"
          quality={85}
          className="object-cover object-center"
          priority={index === 0}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <span className="font-display font-black text-2xl uppercase text-brand-light/30">
            {item.name}
          </span>
        </div>
      )}

      {/* Plays over the image on hover (see the wrapping motion.div's
          onMouseEnter/onMouseLeave below) — CSS alone can toggle visibility
          but can't start/stop playback, hence the ref + handlers instead of
          a plain group-hover peer. */}
      {hoverVideoUrl && (
        <video
          ref={videoRef}
          src={hoverVideoUrl}
          muted
          loop
          playsInline
          preload="none"
          className="absolute inset-0 h-full w-full object-cover object-center opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
      )}

      {/* Purely decorative — sits inside the same Link as the rest of the
          image below, so it shares that click target rather than nesting
          a second interactive element inside it. */}
      {item.slug && (
        <div className="absolute bottom-4 right-4 flex h-11 w-11 translate-y-4 items-center justify-center rounded-full bg-brand-gold text-brand-black opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M3 13L13 3M13 3H6M13 3V10"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}
    </div>
  );

  return (
    <motion.div
      className="group"
      style={{ scale: depthScale, opacity: depthOpacity }}
      onMouseEnter={() => videoRef.current?.play()}
      onMouseLeave={() => {
        const video = videoRef.current;
        if (!video) return;
        video.pause();
        video.currentTime = 0;
      }}
    >
      {item.slug ? (
        <Link href={`/reference/${item.slug}`} className="block cursor-pointer">
          {image}
        </Link>
      ) : (
        image
      )}

      <div className="mt-5 flex items-end justify-between gap-4">
        <div>
          <p className="font-display font-bold text-lg text-brand-light transition-colors duration-300 group-hover:text-brand-gold sm:text-xl">
            {item.name}
          </p>
          {item.tagline && (
            <p className="font-body text-base text-brand-light/50">
              {item.tagline}
            </p>
          )}
        </div>
        {item.url && (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Navštívit ${item.name}`}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-brand-light/20 text-brand-light/50 transition-colors hover:border-brand-gold hover:text-brand-gold"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 13L13 3M13 3H6M13 3V10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        )}
      </div>
    </motion.div>
  );
}

function ClientCardStatic({ item, index }: { item: ClientItem; index: number }) {
  const image = (
    <div className="relative aspect-4/3 w-full overflow-hidden rounded-3xl bg-brand-dark">
      {item.backgroundImage ? (
        <Image
          src={resolveImageUrl(item.backgroundImage)}
          loader={sanityImageLoader}
          alt={item.name}
          fill
          sizes="100vw"
          quality={85}
          className="object-cover object-center"
          priority={index === 0}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <span className="font-display font-black text-2xl uppercase text-brand-light/30">
            {item.name}
          </span>
        </div>
      )}
    </div>
  );

  return (
    <div>
      {item.slug ? (
        <Link href={`/reference/${item.slug}`} className="block">
          {image}
        </Link>
      ) : (
        image
      )}

      <div className="mt-4 flex items-end justify-between gap-4">
        <div>
          <p className="font-display font-bold text-lg text-brand-light">
            {item.name}
          </p>
          {item.tagline && (
            <p className="font-body text-sm text-brand-light/50">
              {item.tagline}
            </p>
          )}
        </div>
        {item.url && (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Navštívit ${item.name}`}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brand-light/20 text-brand-light/50"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 13L13 3M13 3H6M13 3V10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}

/**
 * Horizontal, scroll-scrubbed client showcase — cards enter from the right
 * and scrub left as the section stays pinned, only releasing back to normal
 * vertical scroll once the last card has mostly cleared the viewport. Built
 * on the existing `HorizontalScrollCards` primitive rather than a bespoke
 * pin, so it shares the same scroll-scrub math already used elsewhere.
 *
 * On mobile, the scrub rig gives way to a plain stacked list (no horizontal
 * scroll at all) — both are always mounted, CSS-toggled by breakpoint, so
 * there's no hydration-mismatch risk from a JS media-query check.
 */
export function ClientShowcaseHorizontal({ clients }: Props) {
  if (!clients?.length) return null;

  return (
    <>
      <section className="bg-brand-black px-6 py-16 sm:hidden">
        <p className="font-body text-sm tracking-widest uppercase text-brand-gold mb-4">
          {`{ Naši klienti }`}
        </p>
        <h2 className="font-display font-black uppercase text-xl leading-tight text-brand-light mb-10">
          Značky, které nám důvěřují
        </h2>
        <div className="flex flex-col gap-10">
          {clients.map((client, index) => (
            <ClientCardStatic
              key={`${client.name}-${index}`}
              item={client}
              index={index}
            />
          ))}
        </div>
      </section>

      <div className="hidden sm:block">
        <HorizontalScrollCards
          items={clients}
          itemKey={(client, index) => `${client.name}-${index}`}
          itemWidthVw={38}
          gapVw={8}
          entryVw={75}
          restVw={20}
          entryProgress={0.18}
          startAt={1}
          endAt={0.3}
          speedMultiplier={1.35}
          sidebarOffsetPx={96}
          className="bg-brand-black"
          labelClassName="pr-6 md:pr-10 lg:pr-24 lg:pl-24"
          label={
            <div className="max-w-7xl mx-auto">
              <p className="font-body text-sm tracking-widest uppercase text-brand-gold mb-4">
                {`{ Naši klienti }`}
              </p>
              <h2 className="font-display font-black uppercase text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-tight text-brand-light">
                Značky, které nám důvěřují
              </h2>
            </div>
          }
          renderItem={(args) => <ClientCard {...args} />}
        />
      </div>
    </>
  );
}
