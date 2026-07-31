"use client";

import { useReducedMotion } from "@/hooks/useReducedMotion";

type Props = {
  src: string;
  mimeType?: string;
  mobileSrc?: string;
  mobileMimeType?: string;
};

/**
 * Renders on top of the (always-present) poster image, which stays visible
 * underneath until the video has enough data to paint over it — no extra
 * poster wiring needed. Skipped entirely under reduced motion, not just
 * visually hidden, so the browser never fetches/plays it in that case.
 *
 * `<source media="...">` works the same way it does in `<picture>` — the
 * browser picks the first matching source and only fetches that one, so a
 * portrait mobile clip never causes the desktop clip to download too.
 */
export function HeroBackgroundVideo({
  src,
  mimeType = "video/mp4",
  mobileSrc,
  mobileMimeType = "video/mp4",
}: Props) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) return null;

  return (
    <video
      className="absolute inset-0 w-full h-full object-cover object-center"
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
    >
      {mobileSrc && (
        <source media="(max-width: 767px)" src={mobileSrc} type={mobileMimeType} />
      )}
      <source src={src} type={mimeType} />
    </video>
  );
}
