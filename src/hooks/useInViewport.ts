"use client";

import { useEffect, useState, type RefObject } from "react";

type Options = {
  rootMargin?: string;
  threshold?: number | number[];
};

/**
 * Tracks whether the given element is geometrically intersecting the
 * viewport. Defaults to `true` before the observer's first callback fires,
 * so an element that starts in view isn't incorrectly treated as hidden
 * for that first frame.
 */
export function useInViewport<T extends Element>(
  ref: RefObject<T | null>,
  { rootMargin = "200px 0px", threshold = 0 }: Options = {},
) {
  const [isInViewport, setIsInViewport] = useState(true);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInViewport(entry.isIntersecting),
      { rootMargin, threshold },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref, rootMargin, threshold]);

  return isInViewport;
}
