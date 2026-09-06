import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  /** Solid-filled instead of the default translucent look — for use as an active filter/tab. */
  active?: boolean;
};

/**
 * Brand pill tag for short keywords/labels over dark backgrounds. Uses
 * `--color-brand-gold` (the bright #f5cca2 accent), not `brand-gold-light`
 * — despite the name, that token is a dark bronze (#836342) meant for text
 * on *light* surfaces, and reads as low-contrast/washed-out on black.
 */
export function Badge({ children, className = "", active = false }: Props) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1.5 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 ${
        active
          ? "border-brand-gold bg-brand-gold text-brand-black"
          : "border-brand-gold/50 bg-brand-gold/15 text-brand-gold hover:border-brand-gold hover:bg-brand-gold/25"
      } ${className}`}
    >
      {children}
    </span>
  );
}
