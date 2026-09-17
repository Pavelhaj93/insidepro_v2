"use client";

import Image from "next/image";
import { sanityImageLoader } from "@/sanity/lib/image";

type Props = {
  src: string;
  alt: string;
  sizes: string;
  quality?: number;
  priority?: boolean;
  className?: string;
  /** LQIP base64 string from `asset->metadata.lqip` — shows a blurred preview while the real image loads. */
  blurDataURL?: string;
};

/**
 * `next/image`'s `loader` prop is a function, which can't cross the
 * Server -> Client boundary when rendered inside a client wrapper (e.g.
 * RevealItem/ParallaxLayer) by an async/plain Server Component. Keeping the
 * loader wiring inside this client component means the parent only ever
 * passes serializable props (strings/numbers/booleans).
 */
export function SanityImage({
  src,
  alt,
  sizes,
  quality,
  priority,
  className = "object-cover object-center",
  blurDataURL,
}: Props) {
  return (
    <Image
      src={src}
      loader={sanityImageLoader}
      alt={alt}
      fill
      sizes={sizes}
      quality={quality}
      priority={priority}
      className={className}
      placeholder={blurDataURL ? "blur" : "empty"}
      blurDataURL={blurDataURL}
    />
  );
}
