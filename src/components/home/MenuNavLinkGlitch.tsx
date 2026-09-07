"use client";

import { useScrambleText } from "@/hooks/useScrambleText";

type Props = { label: string; isActive: boolean; reduceMotion: boolean };

export function MenuNavLinkGlitch({ label, isActive, reduceMotion }: Props) {
  const { text, flashing } = useScrambleText(label, {
    active: isActive,
    reduceMotion,
  });

  return (
    <span
      aria-hidden="true"
      className={flashing ? "text-brand-gold" : "text-brand-light"}
    >
      {text}
    </span>
  );
}
