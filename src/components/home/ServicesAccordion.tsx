"use client";

import { useState } from "react";
import { ServicesAccordionScroll } from "./ServicesAccordionScroll";
import { ServicesAccordionClick } from "./ServicesAccordionClick";

type Variant = "scroll" | "click";

const VARIANT_LABELS: Record<Variant, string> = {
  scroll: "Scroll (auto-open)",
  click: "Click (badges always visible)",
};

/**
 * Demo-only switcher between the two interaction variants we built for this
 * POC section, so both can be shown live without editing code — not
 * something a shipped page would have. Dashed border + "Demo" label mark it
 * as scaffolding, not a real UI element.
 */
export function ServicesAccordion() {
  const [variant, setVariant] = useState<Variant>("scroll");

  return (
    <>
      {/*
        `fixed`, not `sticky` — this sits between two sections that use
        negative-margin scroll handoffs (SplitVideoReveal <-> the section
        below), and a sticky/normal-flow sibling here would shift what that
        margin collapses against, breaking the pin-overlap timing. `fixed`
        removes it from flow entirely so it can't interfere.
      */}
      {/* <div className="fixed top-4 right-4 z-30 flex items-center gap-2 rounded-full border border-dashed border-brand-gold/40 bg-brand-black/90 px-4 py-2 backdrop-blur">
        <span className="font-body text-xs tracking-widest uppercase text-brand-light/40">
          Demo:
        </span>
        {(Object.keys(VARIANT_LABELS) as Variant[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setVariant(key)}
            className={`cursor-pointer rounded-full px-3 py-1.5 font-body text-xs tracking-wide transition-colors ${
              variant === key
                ? "bg-brand-gold text-brand-black"
                : "text-brand-light/60 hover:text-brand-light"
            }`}
          >
            {VARIANT_LABELS[key]}
          </button>
        ))}
      </div> */}

      {variant === "scroll" ? (
        <ServicesAccordionScroll />
      ) : (
        <ServicesAccordionClick />
      )}
    </>
  );
}
