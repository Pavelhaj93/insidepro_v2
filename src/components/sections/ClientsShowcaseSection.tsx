"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  PortableText,
  type PortableTextBlock,
  type PortableTextComponents,
} from "next-sanity";
import { urlFor, sanityImageLoader } from "@/sanity/lib/image";

type SanityImage = { asset: { _ref: string } };
type MockImage = { asset: { _ref: string } }; // _ref may also be a plain https:// URL for mocks

type ClientItem = {
  name: string;
  tagline?: string;
  quote?: string;
  body?: PortableTextBlock[];
  url?: string;
  logo?: SanityImage;
  backgroundImage?: MockImage;
};

/**
 * Referenced Project documents carry the quote in `body` (rich text);
 * inline client entries only ever have the plain `quote` string. Renders
 * whichever is present, in the given text style.
 */
function QuoteText({
  client,
  className,
}: {
  client: ClientItem;
  className: string;
}) {
  const content = client.body?.length ? client.body : client.quote;
  if (!content) return null;

  if (typeof content === "string") {
    return <p className={className}>{content}</p>;
  }

  const components: PortableTextComponents = {
    block: {
      normal: ({ children }) => <p className={className}>{children}</p>,
    },
  };
  return <PortableText value={content} components={components} />;
}

/**
 * Resolves either a Sanity image ref or a plain URL (used in mock data) to a
 * base URL with no baked-in size — `sanityImageLoader` appends the exact
 * width/quality/format needed per breakpoint.
 */
function resolveImageUrl(img: MockImage): string {
  const ref = img.asset._ref;
  if (ref.startsWith("http")) {
    const url = new URL(ref);
    url.search = "";
    return url.toString();
  }
  return urlFor(img as SanityImage).url();
}

type Props = {
  label?: string;
  supportLabel?: string;
  showViewAllLink?: boolean;
  viewAllLabel?: string;
  viewAllSlug?: string;
  clients?: ClientItem[];
};

function ClientSlide({
  client,
  index,
  total,
  scrollProgress,
}: {
  client: ClientItem;
  index: number;
  total: number;
  scrollProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  // Each slide occupies 1/total of the scroll range
  const start = index / total;
  const end = (index + 1) / total;

  // Image parallax: moves from 0% to -15% of its own height as this slide scrolls
  const imageY = useTransform(scrollProgress, [start, end], ["0%", "-15%"]);

  // Depth cue: the outgoing slide eases back slightly as the next one takes over.
  const cardScale = useTransform(scrollProgress, [start, end], [1, 0.94]);

  return (
    <div
      className={`sticky top-0 h-screen w-full px-4 md:px-10 pb-20 md:pb-10 ${index === 2 ? "md:pt-0 pt-0" : "md:pt-44 pt-28"}`}
      style={{ zIndex: index + 1 }}
    >
      {/* ── Mobile: flex column — image top, card bottom ───────────────── */}
      <motion.div
        className="flex flex-col h-full w-full rounded-3xl overflow-hidden md:hidden"
        style={{ scale: cardScale }}
      >
        {/* Image — top 55% */}
        <div className="relative w-full bg-black" style={{ flex: "0 0 55%" }}>
          {client.backgroundImage ? (
            <motion.div
              className="absolute inset-0 scale-110"
              style={{ y: imageY }}
            >
              <Image
                src={resolveImageUrl(client.backgroundImage)}
                loader={sanityImageLoader}
                alt={client.name}
                fill
                sizes="110vw"
                quality={85}
                className="object-cover object-center"
                priority={index === 0}
              />
            </motion.div>
          ) : (
            <div className="absolute inset-0 bg-brand-dark" />
          )}
        </div>

        {/* Info card — bottom */}
        <div className="flex-1 bg-black flex flex-col justify-between px-6 py-6">
          <QuoteText
            client={client}
            className="font-display font-normal text-2xl leading-7 tracking-normal text-brand-light mb-4"
          />
          <div>
            <div className="h-px bg-brand-gold mb-5" />
            <div className="flex items-end justify-between gap-4">
              <div>
                {client.logo ? (
                  <div className="relative h-8 w-32 mb-2">
                    <Image
                      src={resolveImageUrl(client.logo)}
                      loader={sanityImageLoader}
                      alt={client.name}
                      fill
                      sizes="128px"
                      className="object-contain object-left filter invert"
                    />
                  </div>
                ) : (
                  <p className="font-display font-black text-2xl leading-7 tracking-normal uppercase text-brand-light mb-1">
                    {client.name}
                  </p>
                )}
                {client.tagline && (
                  <p className="font-display font-black text-xs leading-6 tracking-normal uppercase text-brand-light/50">
                    {client.tagline}
                  </p>
                )}
              </div>
              {client.url && (
                <a
                  href={client.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit ${client.name}`}
                  className="shrink-0 flex items-center justify-center w-10 h-10 border border-brand-light/20 hover:border-brand-gold hover:text-brand-gold text-brand-light/50 transition-colors rounded-xl"
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
        </div>
      </motion.div>

      {/* ── Desktop: full-bleed image with floating card overlay ────────── */}
      <motion.div
        className="relative h-full w-full rounded-3xl overflow-hidden hidden md:block"
        style={{ scale: cardScale }}
      >
        {/* Background image with parallax */}
        {client.backgroundImage ? (
          <motion.div
            className="absolute inset-0 scale-110"
            style={{ y: imageY }}
          >
            <Image
              src={resolveImageUrl(client.backgroundImage)}
              loader={sanityImageLoader}
              alt={client.name}
              fill
              sizes="110vw"
              quality={85}
              className="object-cover object-center"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-linear-to-r from-black/40 via-transparent to-transparent" />
          </motion.div>
        ) : (
          <div className="absolute inset-0 bg-brand-dark" />
        )}

        {/* Floating dark card — right side */}
        <div className="absolute top-1/2 right-10 -translate-y-1/2 w-[38%] bg-[#0D0D0D] flex flex-col justify-between p-10 rounded-3xl">
          <div className="flex-1 flex items-start">
            <QuoteText
              client={client}
              className="font-display font-normal text-3xl leading-8 tracking-normal text-brand-light mb-8"
            />
          </div>
          <div>
            <div className="h-px bg-brand-gold mb-8" />
            <div className="flex items-end justify-between gap-4">
              <div>
                {client.logo ? (
                  <div className="relative h-10 w-40 mb-3">
                    <Image
                      src={resolveImageUrl(client.logo)}
                      loader={sanityImageLoader}
                      alt={client.name}
                      fill
                      sizes="160px"
                      className="object-contain object-left filter invert"
                    />
                  </div>
                ) : (
                  <p className="font-display font-black text-3xl leading-8 tracking-normal uppercase text-brand-light mb-2">
                    {client.name}
                  </p>
                )}
                {client.tagline && (
                  <p className="font-display font-black text-xs leading-6 tracking-normal uppercase text-brand-light/50">
                    {client.tagline}
                  </p>
                )}
              </div>
              {/* TODO: maybe later if client has specific page */}
              {/* {client.url && (
                <a
                  href={client.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit ${client.name}`}
                  className="shrink-0 flex items-center justify-center w-11 h-11 border border-brand-light/20 hover:border-brand-gold hover:text-brand-gold text-brand-light/50 transition-colors"
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
              )} */}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function ClientsShowcaseSection({ label, clients }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  // Stays fully visible through the first two slides, then fades out once
  // during the 3rd slide's own scroll window instead of the whole range.
  const total = clients?.length ?? 0;
  const headlineFadeStart = total > 2 ? 2 / total : 0;
  const headlineOpacity = useTransform(
    scrollYProgress,
    [headlineFadeStart, 1],
    [1, 0],
  );

  if (!clients?.length) return null;

  console.log("ttt clients", clients);

  return (
    <section ref={wrapperRef} style={{ height: `${clients.length * 100}vh` }}>
      {label && (
        <motion.div
          className="sticky top-0 z-0 px-8 md:px-12 pt-20 pointer-events-none"
          style={{ opacity: headlineOpacity }}
        >
          <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl lg:text-7xl leading-tight tracking-normal uppercase text-brand-light mt-2">
            {label}
          </h2>
        </motion.div>
      )}

      {clients.map((client, i) => (
        <ClientSlide
          key={`${client.name}-${i}`}
          client={client}
          index={i}
          total={clients.length}
          scrollProgress={scrollYProgress}
        />
      ))}
    </section>
  );
}
