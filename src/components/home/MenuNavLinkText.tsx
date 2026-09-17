"use client";

import { cn } from "@/lib/utils";

type Props = {
  label: string;
  isActive: boolean;
  dimmed: boolean;
  reduceMotion: boolean;
};

/**
 * Minimal hover: the hovered word crossfades from light to gold; no lift, no
 * underline. `dimmed` (set by the parent list when a *different* sibling is
 * hovered) fades this link toward the background so the active one pops by
 * contrast — a "spotlight" effect achieved with opacity alone.
 */
export function MenuNavLinkText({ label, isActive, dimmed, reduceMotion }: Props) {
  return (
    <span
      className={cn(
        "menu-link-text",
        isActive && "is-active",
        dimmed && "is-dimmed",
        reduceMotion && "reduce-motion"
      )}
    >
      {label}
    </span>
  );
}
