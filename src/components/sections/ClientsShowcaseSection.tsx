"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { urlFor } from "@/sanity/lib/image";

type SanityImage = { asset: { _ref: string } };
type MockImage = { asset: { _ref: string } }; // _ref may also be a plain https:// URL for mocks

type ClientItem = {
  name: string;
  tagline?: string;
  quote?: string;
  url?: string;
  logo?: SanityImage;
  backgroundImage?: MockImage;
};

/** Resolves either a Sanity image ref or a plain URL (used in mock data). */
function resolveImageUrl(
  img: MockImage,
  width: number,
  height: number,
): string {
  const ref = img.asset._ref;
  if (ref.startsWith("http")) return ref;
  return urlFor(img as SanityImage)
    .width(width)
    .height(height)
    .url();
}

type Props = {
  label?: string;
  supportLabel?: string;
  clients?: ClientItem[];
};

// ─── Mock data — replace with real Sanity data when available ────────────────
const MOCK_CLIENTS: ClientItem[] = [
  {
    name: "Kingspan",
    tagline: "Globální lídr ve svém oboru",
    quote: "Důvěřují nám značky, které nemají prostor pro kompromisy.",
    url: "https://www.kingspan.com",
    backgroundImage: {
      asset: {
        _ref: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=1600&h=1200&fit=crop&auto=format",
      },
    },
  },
  {
    name: "Iscare",
    tagline: "Prestižní soukromá klinika",
    quote:
      "Jedna značka. Jeden tým. Nemusíte koordinovat agenturu, produkci a správu kampaní.",
    url: "https://www.iscare.cz",
    backgroundImage: {
      asset: {
        _ref: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&h=1200&fit=crop&auto=format",
      },
    },
  },
  {
    name: "Feri",
    tagline: "Významná česká stavební firma",
    quote: "Navrhujeme identity. Natáčíme filmy. Spravujeme komunikaci.",
    url: "https://www.feri.cz",
    backgroundImage: {
      asset: {
        _ref: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&h=1200&fit=crop&auto=format",
      },
    },
  },
];

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

  return (
    <div
      className="sticky top-0 h-screen w-full px-4 pb-4 pt-20 md:px-10 md:pb-10 md:pt-28"
      style={{ zIndex: index + 1 }}
    >
      {/* ── Mobile: flex column — image top, card bottom ───────────────── */}
      <div className="flex flex-col h-full w-full rounded-3xl overflow-hidden md:hidden">
        {/* Image — top 55% */}
        <div className="relative w-full" style={{ flex: "0 0 55%" }}>
          {client.backgroundImage ? (
            <motion.div
              className="absolute inset-0 scale-110"
              style={{ y: imageY }}
            >
              <Image
                src={resolveImageUrl(client.backgroundImage, 800, 600)}
                alt={client.name}
                fill
                className="object-cover object-center"
                priority={index === 0}
              />
            </motion.div>
          ) : (
            <div className="absolute inset-0 bg-brand-dark" />
          )}
        </div>

        {/* Info card — bottom */}
        <div className="flex-1 bg-[#0D0D0D] flex flex-col justify-between px-6 py-6">
          {client.quote && (
            <p className="font-display font-normal text-[22px] leading-[28px] tracking-normal text-brand-light mb-4">
              {client.quote}
            </p>
          )}
          <div>
            <div className="h-px bg-brand-gold mb-5" />
            <div className="flex items-end justify-between gap-4">
              <div>
                {client.logo ? (
                  <div className="relative h-8 w-32 mb-2">
                    <Image
                      src={resolveImageUrl(client.logo, 320, 80)}
                      alt={client.name}
                      fill
                      className="object-contain object-left filter invert"
                    />
                  </div>
                ) : (
                  <p className="font-display font-black text-[22px] leading-[26px] tracking-normal uppercase text-brand-light mb-1">
                    {client.name}
                  </p>
                )}
                {client.tagline && (
                  <p className="font-display font-black text-[10px] leading-5.75 tracking-normal uppercase text-brand-light/50">
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
      </div>

      {/* ── Desktop: full-bleed image with floating card overlay ────────── */}
      <div className="relative h-full w-full rounded-3xl overflow-hidden hidden md:block">
        {/* Background image with parallax */}
        {client.backgroundImage ? (
          <motion.div
            className="absolute inset-0 scale-110"
            style={{ y: imageY }}
          >
            <Image
              src={resolveImageUrl(client.backgroundImage, 1600, 1200)}
              alt={client.name}
              fill
              className="object-cover object-center"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-linear-to-r from-black/40 via-transparent to-transparent" />
          </motion.div>
        ) : (
          <div className="absolute inset-0 bg-brand-dark" />
        )}

        {/* Floating dark card — right side */}
        <div className="absolute top-10 right-10 bottom-10 w-[38%] bg-[#0D0D0D] flex flex-col justify-between p-10 rounded-3xl">
          <div className="flex-1 flex items-start">
            {client.quote && (
              <p className="font-display font-normal text-[31.28px] leading-[35.6px] tracking-normal text-brand-light">
                {client.quote}
              </p>
            )}
          </div>
          <div>
            <div className="h-px bg-brand-gold mb-8" />
            <div className="flex items-end justify-between gap-4">
              <div>
                {client.logo ? (
                  <div className="relative h-10 w-40 mb-3">
                    <Image
                      src={resolveImageUrl(client.logo, 320, 80)}
                      alt={client.name}
                      fill
                      className="object-contain object-left filter invert"
                    />
                  </div>
                ) : (
                  <p className="font-display font-black text-[31.28px] leading-[30.64px] tracking-normal uppercase text-brand-light mb-2">
                    {client.name}
                  </p>
                )}
                {client.tagline && (
                  <p className="font-display font-black text-[10px] leading-5.75 tracking-normal uppercase text-brand-light/50">
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
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ClientsShowcaseSection({ label, clients: _clients }: Props) {
  const activeClients = MOCK_CLIENTS;
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  if (!activeClients.length) return null;

  return (
    <section
      ref={wrapperRef}
      style={{ height: `${activeClients.length * 100}vh` }}
    >
      {label && (
        <div className="sticky top-0 z-0 px-8 md:px-12 pt-6 pointer-events-none">
          <p className="font-body text-xs tracking-widest text-brand-light/30 uppercase">
            {label}
          </p>
        </div>
      )}

      {activeClients.map((client, i) => (
        <ClientSlide
          key={`${client.name}-${i}`}
          client={client}
          index={i}
          total={activeClients.length}
          scrollProgress={scrollYProgress}
        />
      ))}
    </section>
  );
}
