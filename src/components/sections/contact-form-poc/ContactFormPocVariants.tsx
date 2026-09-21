"use client";

import { useState } from "react";
import { VariantASteps } from "./VariantASteps";
import { VariantBMadlibs } from "./VariantBMadlibs";
import { VariantCClapperboard } from "./VariantCClapperboard";

const VARIANTS = [
  { key: "a", label: "A" },
  { key: "b", label: "B" },
  { key: "c", label: "C" },
] as const;

type VariantKey = (typeof VARIANTS)[number]["key"];

/**
 * Fixed corner switcher for comparing the three contact-form design
 * variants live, without a page reload — same pattern as
 * `casestudy-poc/CaseStudyPocVariants.tsx`. Design-POC only, no Sanity/
 * backend wiring; see the plan doc for what happens once a direction wins.
 */
export function ContactFormPocVariants() {
  const [variant, setVariant] = useState<VariantKey>("a");

  return (
    <div className="relative">
      <div className="fixed top-24 right-6 z-50 flex gap-1 rounded-full border border-brand-gold/50 bg-brand-black/90 p-1 backdrop-blur">
        {VARIANTS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setVariant(key)}
            aria-pressed={variant === key}
            className={`h-9 w-9 rounded-full font-body text-sm font-medium transition-colors ${
              variant === key
                ? "bg-brand-gold text-brand-black"
                : "text-brand-gold hover:bg-brand-gold/15"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {variant === "a" && <VariantASteps />}
      {variant === "b" && <VariantBMadlibs />}
      {variant === "c" && <VariantCClapperboard />}
    </div>
  );
}
