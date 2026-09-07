"use client";

import Link from "next/link";
import { useState } from "react";
import { MenuNavLinkGradient } from "./MenuNavLinkGradient";
import { MenuNavLinkWave } from "./MenuNavLinkWave";
import { MenuNavLinkGlitch } from "./MenuNavLinkGlitch";
import { MenuNavLinkWipe } from "./MenuNavLinkWipe";

export type MenuEffect = "gradient" | "wave" | "glitch" | "wipe";

type Props = {
  label: string;
  href: string;
  effect: MenuEffect;
  reduceMotion: boolean;
  onNavigate: () => void;
};

/**
 * Single source of hover/focus/reduced-motion wiring for the fullscreen nav
 * links — the effect renderers below are presentational and just react to
 * `isActive`/`reduceMotion`, so mouse and keyboard behave identically.
 */
export function MenuNavLink({
  label,
  href,
  effect,
  reduceMotion,
  onNavigate,
}: Props) {
  const [isActive, setIsActive] = useState(false);

  // Wave/glitch fragment or rewrite the visible characters, so the accessible
  // name is pinned via aria-label and the visual content is aria-hidden in
  // each renderer. Gradient/wipe keep the real text node, so no override is needed.
  const ariaLabel =
    effect === "gradient" || effect === "wipe" ? undefined : label;

  return (
    <Link
      href={href}
      onClick={onNavigate}
      onMouseEnter={() => setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}
      onFocus={() => setIsActive(true)}
      onBlur={() => setIsActive(false)}
      aria-label={ariaLabel}
      className="relative inline-block select-none rounded-sm text-6xl font-black uppercase leading-[0.9] tracking-tight font-display outline-none sm:text-7xl md:text-8xl lg:text-[7.5rem] focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-4 focus-visible:ring-offset-brand-black"
    >
      {effect === "gradient" && (
        <MenuNavLinkGradient
          label={label}
          isActive={isActive}
          reduceMotion={reduceMotion}
        />
      )}
      {effect === "wave" && (
        <MenuNavLinkWave
          label={label}
          isActive={isActive}
          reduceMotion={reduceMotion}
        />
      )}
      {effect === "glitch" && (
        <MenuNavLinkGlitch
          label={label}
          isActive={isActive}
          reduceMotion={reduceMotion}
        />
      )}
      {effect === "wipe" && (
        <MenuNavLinkWipe
          label={label}
          isActive={isActive}
          reduceMotion={reduceMotion}
        />
      )}
    </Link>
  );
}
