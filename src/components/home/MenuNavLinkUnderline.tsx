"use client";

import { cn } from "@/lib/utils";

type Props = { label: string; isActive: boolean; reduceMotion: boolean };

/**
 * Clean, minimal hover: the word itself just lifts a touch and warms to gold
 * while a thin underline draws in from the left beneath it — one moving
 * line and a small nudge, nothing fragmenting or looping, so it reads as
 * restrained next to the louder Gradient/Wave/Wipe effects.
 */
export function MenuNavLinkUnderline({ label, isActive, reduceMotion }: Props) {
  return (
    <span
      className={cn(
        "menu-link-underline",
        isActive && "is-active",
        reduceMotion && "reduce-motion"
      )}
    >
      <span className="menu-link-underline-inner">{label}</span>
      <span className="menu-link-underline-bar" aria-hidden="true" />
    </span>
  );
}
