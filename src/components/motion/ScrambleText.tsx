"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

type Props = {
  children: React.ReactNode;
  duration?: number;
};

/**
 * Decode-in text effect: random glyphs settle into the real characters over
 * `duration` ms. Operates directly on rendered text nodes (via TreeWalker)
 * rather than re-rendering `children`, so it works on top of arbitrarily rich
 * markup (PortableText marks — colored spans, <strong>, <em>, <br/>) without
 * needing to know its structure. Reduced motion: no-op, final text shows
 * immediately since `children` render normally either way.
 */
export function ScrambleText({ children, duration = 650 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduceMotion) return;

    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const textNodes: Text[] = [];
    let node: Node | null;
    while ((node = walker.nextNode())) {
      if (node.textContent?.trim()) textNodes.push(node as Text);
    }
    if (!textNodes.length) return;

    const originals = textNodes.map((n) => n.textContent ?? "");
    const start = performance.now();
    let rafId: number;

    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1);

      textNodes.forEach((n, i) => {
        const original = originals[i];
        const revealCount = Math.floor(original.length * progress);
        let out = "";
        for (let c = 0; c < original.length; c++) {
          const ch = original[c];
          out +=
            ch === " " || c < revealCount
              ? ch
              : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
        n.textContent = out;
      });

      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        textNodes.forEach((n, i) => {
          n.textContent = originals[i];
        });
      }
    }
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      textNodes.forEach((n, i) => {
        n.textContent = originals[i];
      });
    };
  }, [reduceMotion, duration]);

  return <span ref={ref}>{children}</span>;
}
