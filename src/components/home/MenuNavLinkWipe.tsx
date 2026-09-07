"use client";

import { cn } from "@/lib/utils";

type Props = { label: string; isActive: boolean; reduceMotion: boolean };

/**
 * Continuous left-to-right fill wipe: the label sits as a light outline
 * (transparent fill + stroke) at rest, and a hard-edged gold/transparent
 * background clipped to the text sweeps across it in one smooth motion
 * while active — not a per-letter or per-frame effect, a single continuous
 * transition of the fill boundary from the start of the word to its end.
 */
export function MenuNavLinkWipe({ label, isActive, reduceMotion }: Props) {
  return (
    <span
      className={cn(
        "menu-link-wipe",
        isActive && "is-active",
        reduceMotion && "reduce-motion"
      )}
    >
      {label}
    </span>
  );
}
