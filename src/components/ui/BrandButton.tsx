"use client";

import Link from "next/link";
import type { MouseEventHandler, ReactNode } from "react";

type Variant = "gold" | "light";

type Props = {
  children: ReactNode;
  href?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit";
  variant?: Variant;
  className?: string;
};

const VARIANT_CLASSES: Record<Variant, string> = {
  gold: "border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-black",
  light: "border-brand-light text-brand-light hover:bg-brand-light hover:text-brand-black",
};

/**
 * Shared outline CTA button — same shape/typography already used across the
 * site (uppercase, tracking-widest, px-8 py-4, border that fills on hover),
 * pulled into one place with a color variant. `gold` uses the actual bright
 * `--color-brand-gold` token, not `brand-gold-light` (a dark bronze meant
 * for light surfaces — see Badge.tsx's note on the same mixup).
 *
 * Named `BrandButton`, not `Button` — `src/components/ui/button.tsx`
 * already exists (an unused shadcn primitive on generic tokens) and macOS's
 * case-insensitive filesystem treats `Button.tsx`/`button.tsx` as the same
 * file, which broke the TS build.
 */
export function BrandButton({
  children,
  href,
  onClick,
  type = "button",
  variant = "gold",
  className = "",
}: Props) {
  const classes = `inline-block rounded-full font-body text-sm tracking-widest uppercase px-8 py-4 border transition-colors ${VARIANT_CLASSES[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
