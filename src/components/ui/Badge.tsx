import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  /** Solid-filled instead of the default translucent look — for use as an active filter/tab. */
  active?: boolean;
  /**
   * White/light scheme instead of the default gold — for a tag that needs to
   * visually stand out as a different kind of thing among a row of regular
   * (gold) badges, e.g. the Showreel filter tab among category filters.
   */
  accent?: boolean;
};

/**
 * Brand pill tag for short keywords/labels over dark backgrounds. Uses
 * `--color-brand-gold` (the bright #f5cca2 accent), not `brand-gold-light`
 * — despite the name, that token is a dark bronze (#836342) meant for text
 * on *light* surfaces, and reads as low-contrast/washed-out on black.
 */
export function Badge({
  children,
  className = "",
  active = false,
  accent = false,
}: Props) {
  const colorClasses = accent
    ? active
      ? "border-brand-light bg-brand-light text-brand-black"
      : "border-brand-light/50 bg-brand-light/15 text-brand-light hover:border-brand-light hover:bg-brand-light/25"
    : active
      ? "border-brand-gold bg-brand-gold text-brand-black"
      : "border-brand-gold/50 bg-brand-gold/15 text-brand-gold hover:border-brand-gold hover:bg-brand-gold/25";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1.5 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 ${colorClasses} ${className}`}
    >
      {children}
    </span>
  );
}
