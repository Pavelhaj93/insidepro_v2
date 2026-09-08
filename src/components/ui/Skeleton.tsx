"use client";

import { useReducedMotion } from "@/hooks/useReducedMotion";

type SkeletonTextProps = {
  /** Number of lines to render. */
  lines?: number;
  /** Width of the last line (all others are full width) — mimics a paragraph's ragged end. */
  lastLineWidth?: string;
  className?: string;
};

/** Placeholder for a block of body copy — design-POC only, not a general loading state. */
export function SkeletonText({
  lines = 4,
  lastLineWidth = "w-2/3",
  className = "",
}: SkeletonTextProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div className={`flex flex-col gap-3 ${className}`} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`h-4 rounded-full bg-brand-dark ${
            reduceMotion ? "" : "animate-skeleton-shimmer"
          } ${i === lines - 1 ? lastLineWidth : "w-full"}`}
        />
      ))}
    </div>
  );
}

type SkeletonImageProps = {
  /** Aspect ratio utility class, e.g. "aspect-4/3", "aspect-video". */
  aspectClassName?: string;
  className?: string;
};

/** Placeholder for an image slot — design-POC only. */
export function SkeletonImage({
  aspectClassName = "aspect-4/3",
  className = "",
}: SkeletonImageProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className={`relative overflow-hidden rounded-4xl bg-brand-dark ${aspectClassName} ${className}`}
    >
      <div
        className={`absolute inset-0 ${
          reduceMotion ? "bg-brand-grey/40" : "animate-skeleton-shimmer"
        }`}
      />
    </div>
  );
}
