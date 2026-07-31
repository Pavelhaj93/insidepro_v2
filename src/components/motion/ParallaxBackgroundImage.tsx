"use client";

import Image from "next/image";
import { sanityImageLoader } from "@/sanity/lib/image";
import { ParallaxLayer } from "./ParallaxLayer";

type Props = {
  src: string;
  mobileSrc?: string;
  alt?: string;
  sizes: string;
  quality?: number;
  priority?: boolean;
  intensity?: number;
  className?: string;
};

/**
 * `next/image`'s `loader` prop is a function, which can't cross the
 * Server -> Client boundary when this is rendered by an async Server
 * Component (e.g. HeroSection). Keeping the Image + loader wiring inside
 * this client component means only serializable props (strings/numbers/
 * booleans) are passed in from the server side.
 */
export function ParallaxBackgroundImage({
  src,
  mobileSrc,
  alt = "",
  sizes,
  quality,
  priority,
  intensity = 12,
  className = "object-cover object-center",
}: Props) {
  return (
    <ParallaxLayer intensity={intensity}>
      {mobileSrc ? (
        <>
          <Image
            src={mobileSrc}
            loader={sanityImageLoader}
            alt={alt}
            fill
            sizes={sizes}
            quality={quality}
            className={`${className} block md:hidden`}
            priority={priority}
          />
          <Image
            src={src}
            loader={sanityImageLoader}
            alt={alt}
            fill
            sizes={sizes}
            quality={quality}
            className={`${className} hidden md:block`}
            priority={priority}
          />
        </>
      ) : (
        <Image
          src={src}
          loader={sanityImageLoader}
          alt={alt}
          fill
          sizes={sizes}
          quality={quality}
          className={className}
          priority={priority}
        />
      )}
    </ParallaxLayer>
  );
}
