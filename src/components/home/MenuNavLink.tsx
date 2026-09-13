"use client";

import Link from "next/link";
import { useState } from "react";
import { MenuNavLinkUnderline } from "./MenuNavLinkUnderline";

type Props = {
  label: string;
  href: string;
  reduceMotion: boolean;
  onNavigate: () => void;
};

/**
 * Single source of hover/focus/reduced-motion wiring for the fullscreen nav
 * links — MenuNavLinkUnderline is presentational and just reacts to
 * `isActive`/`reduceMotion`, so mouse and keyboard behave identically.
 */
export function MenuNavLink({ label, href, reduceMotion, onNavigate }: Props) {
  const [isActive, setIsActive] = useState(false);

  return (
    <Link
      href={href}
      onClick={onNavigate}
      onMouseEnter={() => setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}
      onFocus={() => setIsActive(true)}
      onBlur={() => setIsActive(false)}
      className="relative inline-block select-none rounded-sm text-4xl font-black uppercase leading-[0.9] tracking-tight font-display outline-none sm:text-7xl md:text-8xl lg:text-[7.5rem] focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-4 focus-visible:ring-offset-brand-black"
    >
      <MenuNavLinkUnderline
        label={label}
        isActive={isActive}
        reduceMotion={reduceMotion}
      />
    </Link>
  );
}
