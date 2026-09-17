"use client";

import { useEffect, useState } from "react";

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789*#";

function randomGlyph() {
  return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
}

type UseScrambleTextOptions = {
  active: boolean;
  reduceMotion: boolean;
  /** ms between scramble frames. */
  frameMs?: number;
  /** probability [0..1] a given character is re-randomized on a given frame. */
  scrambleChance?: number;
  /** probability [0..1] a frame briefly flashes gold. */
  flashChance?: number;
};

/**
 * Continuously scrambles `text` while `active` is true (never fully resolving),
 * resetting instantly to the real text the moment `active` goes false or
 * reduced motion is requested. SSR/hydration-safe: initial state is always the
 * real, unscrambled text (identical on server and first client render) — the
 * interval, and all Math.random() calls, only run inside a client effect after
 * mount, gated on `active` (false until the menu is open and a link is
 * hovered/focused), so there is no possible mismatch.
 */
export function useScrambleText(
  text: string,
  {
    active,
    reduceMotion,
    frameMs = 45,
    scrambleChance = 0.85,
    flashChance = 0.12,
  }: UseScrambleTextOptions
) {
  const [scrambled, setScrambled] = useState({ text, flashing: false });

  useEffect(() => {
    if (!active || reduceMotion) return;
    const id = window.setInterval(() => {
      const next = text
        .split("")
        .map((char) =>
          char === " "
            ? " "
            : Math.random() < scrambleChance
              ? randomGlyph()
              : char
        )
        .join("");
      setScrambled({ text: next, flashing: Math.random() < flashChance });
    }, frameMs);
    return () => window.clearInterval(id);
  }, [active, reduceMotion, text, frameMs, scrambleChance, flashChance]);

  // Falls back to the real, unscrambled text whenever inactive/reduced-motion —
  // avoids resetting internal state synchronously from the effect body itself.
  return active && !reduceMotion ? scrambled : { text, flashing: false };
}
