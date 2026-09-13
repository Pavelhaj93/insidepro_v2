"use client";

import { useState } from "react";
import Link from "next/link";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";

type NavLink = { label: string; href: string; translatedLabel?: string };

type Props = {
  navLinks: NavLink[];
  onNavigate: () => void;
  reduceMotion: boolean;
};

// Circle radius (px) — big enough to comfortably straddle two adjacent
// lines when hovering near the boundary between them.
const RADIUS = 180;
const SPRING = { stiffness: 350, damping: 40, mass: 0.5 };

const listClassName =
  "flex flex-col items-center gap-2 text-center sm:gap-3 md:gap-4";
const linkClassName =
  "relative inline-block select-none rounded-sm text-4xl font-black uppercase leading-[0.9] tracking-tight font-display outline-none sm:text-7xl md:text-8xl lg:text-[7.5rem] focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-4 focus-visible:ring-offset-brand-black";

/**
 * "Spotlight" menu mode: a circle follows the cursor across the *whole*
 * menu panel — not just the words. Inside it, everything inverts to a light
 * background with a full duplicate of the menu underneath (same links,
 * translated to English, dark text); outside it, the normal dark Czech
 * menu. Because the light layer is a real full-panel duplicate rather than
 * a per-word swap, the circle reveals whatever it happens to be over —
 * empty space between links included — and can straddle two links at once
 * and reveal both, not just whichever single one the pointer is nearest to.
 */
export function MenuSpotlightList({
  navLinks,
  onNavigate,
  reduceMotion,
}: Props) {
  const [isHovering, setIsHovering] = useState(false);
  const x = useMotionValue(-9999);
  const y = useMotionValue(-9999);
  const springX = useSpring(x, SPRING);
  const springY = useSpring(y, SPRING);
  const clipPath = useMotionTemplate`circle(${RADIUS}px at ${springX}px ${springY}px)`;

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
  }

  return (
    <div
      className="relative flex h-full w-full items-center justify-center"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <ul className={listClassName}>
        {navLinks.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              onClick={onNavigate}
              className={`${linkClassName} text-brand-light`}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      {!reduceMotion && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex items-center justify-center bg-brand-light"
          style={{ clipPath, opacity: isHovering ? 1 : 0 }}
        >
          <ul className={listClassName}>
            {navLinks.map((link) => (
              <li key={link.href}>
                <span className={`${linkClassName} text-brand-black`}>
                  {link.translatedLabel ?? link.label}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  );
}
