"use client";

import Link from "next/link";
import { useState } from "react";
import { MenuNavLinkText } from "./MenuNavLinkText";

type Props = {
  label: string;
  href: string;
  reduceMotion: boolean;
  onNavigate: () => void;
  /** True when a *different* sibling link in the list is currently hovered/focused. */
  dimmed?: boolean;
  /** Reports this link's own hover/focus state up so the parent list can dim its siblings. */
  onHoverChange?: (href: string, active: boolean) => void;
};

/**
 * Single source of hover/focus/reduced-motion wiring for the fullscreen nav
 * links — MenuNavLinkText is presentational and just reacts to
 * `isActive`/`dimmed`/`reduceMotion`, so mouse and keyboard behave identically.
 */
export function MenuNavLink({
  label,
  href,
  reduceMotion,
  onNavigate,
  dimmed = false,
  onHoverChange,
}: Props) {
  const [isActive, setIsActive] = useState(false);

  function setActive(active: boolean) {
    setIsActive(active);
    onHoverChange?.(href, active);
  }

  return (
    <Link
      href={href}
      onClick={onNavigate}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      className="relative inline-block select-none rounded-sm text-4xl font-black uppercase leading-[0.9] tracking-tight font-display outline-none sm:text-7xl md:text-8xl lg:text-[7.5rem] focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-4 focus-visible:ring-offset-brand-black"
    >
      <MenuNavLinkText
        label={label}
        isActive={isActive}
        dimmed={dimmed}
        reduceMotion={reduceMotion}
      />
    </Link>
  );
}
