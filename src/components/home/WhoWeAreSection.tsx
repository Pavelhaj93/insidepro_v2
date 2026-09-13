"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { InvertedCorner } from "../icons/InvertedCorner";

type BadgeLogo = { asset: { _ref: string } };

// Placeholder paths — content creator still needs to drop in
// left_image-2.png .. left_image-5.png next to the existing left_image.png.
// Until then slides 2-5 will 404; swap this array for real filenames (or
// wire it up to a Sanity array field) once the photos exist.
const LEFT_PHOTOS = [
  "/images/left_image.png",
  "/images/left_image-2.jpg",
  "/images/left_image-3.jpg",
  "/images/left_image-4.jpg",
  "/images/left_image-5.jpg",
];

const CAROUSEL_INTERVAL_MS = 3000;

function PhotoCarousel({
  images,
  reduceMotion,
}: {
  images: string[];
  reduceMotion: boolean;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (reduceMotion || images.length <= 1) return;
    const id = setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length);
    }, CAROUSEL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [images.length, reduceMotion]);

  return (
    <>
      {images.map((src, index) => (
        <Image
          key={src}
          src={src}
          alt="Foto z produkce"
          fill
          sizes="(min-width: 1024px) 65vw, 100vw"
          priority={index === 0}
          className={`object-cover object-center transition-opacity duration-700 ease-out ${
            index === activeIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2 sm:bottom-5">
          {images.map((src, index) => (
            <button
              key={src}
              type="button"
              aria-label={`Zobrazit fotku ${index + 1}`}
              aria-pressed={index === activeIndex}
              onClick={() => setActiveIndex(index)}
              className={`h-2 rounded-full transition-all ${
                index === activeIndex
                  ? "w-6 bg-brand-light"
                  : "w-2 bg-brand-light/40"
              }`}
            />
          ))}
        </div>
      )}
    </>
  );
}

// Reference design (3 screenshots: desktop/tablet/mobile) was a light-theme
// template ("Who We Are" / "BrightEdge Studio") — recreated here in this
// page's dark theme with real insidePRO copy. Photos are placeholder blocks
// (no real behind-the-scenes photography wired up yet), everything else —
// the organic-cornered image shapes, the overlapping circular badge, the
// "story" card, and the responsive reflow — matches the reference.
//
// Layout notes: a single 4-column-worth of children (heading, big photo,
// second photo, story card) are reflowed per breakpoint purely with
// Tailwind's grid placement + `order`, no separate markup per breakpoint:
//  - mobile (1 col): heading, big photo, second photo, story card
//  - tablet (2 col): heading (full width), big photo (full width),
//    story card + second photo side by side
//  - desktop (2 col, photo column wider): heading (full width), big photo
//    spanning both rows on the left, story card then second photo stacked
//    on the right
// Only the mobile order differs (second photo before the story card, the
// other two breakpoints share DOM order) — see the `order-*` classes below.
function CircularBadge({
  reduceMotion,
  logo,
}: {
  reduceMotion: boolean;
  logo?: BadgeLogo | null;
}) {
  const label = "TVOŘÍME • KREATIVITU • EMOCE • PŘÍBĚHY • ";

  return (
    <div className="absolute bottom-8 left-8 z-20 flex h-28 w-28 items-center justify-center sm:bottom-5 sm:left-5 sm:h-32 sm:w-32">
      <div className="absolute inset-0 rounded-full border border-brand-light bg-brand-black" />
      {/* Only the text ring spins — the logo sits outside this <svg>, so it
          stays perfectly still at the center while the text rotates around it. */}
      <svg
        viewBox="0 0 100 100"
        className={`absolute inset-0 h-full w-full ${
          reduceMotion ? "" : "animate-badge-rotate"
        }`}
      >
        <defs>
          <path
            id="who-we-are-badge-path"
            d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"
            fill="none"
          />
        </defs>
        <text
          fontSize="9"
          letterSpacing="1"
          className="fill-brand-light uppercase font-body"
        >
          <textPath href="#who-we-are-badge-path">{label}</textPath>
        </text>
      </svg>
      <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full sm:h-18 sm:w-18">
        {logo ? (
          <Image
            src={urlFor(logo).height(80).url()}
            alt="insidePRO"
            fill
            sizes="56px"
            className="object-contain p-2.5"
          />
        ) : (
          <span className="h-2.5 w-2.5 rounded-full bg-brand-black" />
        )}
      </div>
    </div>
  );
}

type Props = {
  logo?: BadgeLogo | null;
};

export function WhoWeAreSection({ logo }: Props) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="bg-brand-black pl-6 sm:pl-24 lg:pl-48 pr-6 py-24 md:pr-10 md:py-16 lg:pr-24 lg:flex lg:items-center">
      {/* Column split confirmed from the live reference's actual markup
          (image `sizes` attrs: 65% / 35% of the content width) — not a
          rough guess.
          `lg:grid-rows-[auto_auto_1fr]` (heading / story-card / image) is
          what gives the story card a flexible, content-based height while
          the image fills whatever's left: the big photo spans the last
          two rows needing 570px total, and CSS Grid's track-sizing
          algorithm hands any of that 570px the auto (story) row doesn't
          use to the 1fr (image) row automatically. */}
      <div className="grid w-full max-w-7xl mx-auto grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-[65fr_35fr] lg:grid-rows-[auto_auto_1fr] lg:gap-x-10">
        <div className="order-1 sm:col-span-2 lg:col-span-2">
          <p className="font-body text-sm tracking-widest uppercase text-brand-gold mb-4">
            {"{ Kdo jsme }"}
          </p>
          <h2 className="font-display font-black uppercase text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-tight text-brand-light">
            Jsme přední kreativní produkční agentura
          </h2>
        </div>

        <div className="relative order-2 sm:col-span-2 lg:col-span-1 lg:row-span-2">
          {/* Landscape on mobile/tablet; fixed 570px on desktop, matching
              the reference's actual measured height. */}
          <div className="relative aspect-6/5 overflow-hidden rounded-tl-[3rem] rounded-tr-[3rem] rounded-br-[3rem] bg-brand-dark sm:aspect-16/11 lg:aspect-auto lg:h-142.5">
            <PhotoCarousel images={LEFT_PHOTOS} reduceMotion={reduceMotion} />
          </div>
          <InvertedCorner className="absolute rotate-90 left-44 bottom-0 w-8 h-8 text-brand-black" />
          <InvertedCorner className="absolute rotate-90 left-0 bottom-44 w-8 h-8 text-brand-black" />
          {/* Backdrop matching the section background, so the badge
                reads as sitting on a cut-out of the photo rather than just
                floating over it — same idea as the reference's white box. */}
          <div className="absolute bottom-0 left-0 z-10 h-32 w-32 rounded-tr-[5.5rem] bg-brand-black sm:h-44 sm:w-44" />
          <CircularBadge reduceMotion={reduceMotion} logo={logo} />
        </div>

        <div className="relative order-4 sm:order-3 lg:order-3 rounded-4xl overflow-hidden bg-brand-dark">
          {/* "OUR MISSION" sits in a solid-black tab cut into the card's
              top-left corner — same technique as TeamShowcaseSection's
              name/role label: two InvertedCorner fillets smooth the two
              seams where the tab's free edges meet the card's edges, and
              the tab's one truly-interior corner gets a plain CSS rounding
              (rounded-br-4xl) instead. The card's own rounded-4xl +
              overflow-hidden clips the tab's flush top-left corner to
              match the card's silhouette. */}
          <div className="relative inline-flex w-fit items-center bg-brand-black px-8 py-6 rounded-br-4xl md:px-10 md:py-7">
            <p className="font-display font-bold text-xl text-brand-light tracking-tighter">
              Our mission
            </p>
            <InvertedCorner className="absolute left-full top-0 h-8 w-8 rotate-180 text-brand-black" />
            <InvertedCorner className="absolute top-full left-0 h-8 w-8 rotate-180 text-brand-black" />
          </div>

          <p className="font-body text-lg leading-7 text-brand-light/70 px-8 pt-6 pb-8 md:px-10 md:pt-7 md:pb-10">
            Pomáháme firmám růst prostřednictvím strategie, kreativity a
            kvalitního obsahu. Propojujeme produkci, branding a marketing do
            jednoho funkčního celku, který dává značkám jasný směr a podporuje
            jejich dlouhodobý růst.
          </p>
        </div>

        <div className="order-3 sm:order-4 lg:order-4">
          {/* Uniform rounding on every corner (unlike the big photo's
                mismatched "blob" corners). A landscape ratio at desktop —
                not a fixed height — keeps it shorter than the story card
                stacked above it without also shrinking the big photo,
                which stretches to match this column's *total* height. */}
          <div className="relative aspect-4/3 overflow-hidden rounded-4xl bg-brand-dark lg:aspect-auto lg:h-full">
            <Image
              src="/images/right_image.png"
              alt="Tým"
              fill
              sizes="(min-width: 1024px) 35vw, 100vw"
              className="object-cover object-center"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
