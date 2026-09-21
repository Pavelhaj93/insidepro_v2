"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Reveal } from "@/components/motion/Reveal";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { BrandButton } from "@/components/ui/BrandButton";
import { useFakeSubmit } from "./useFakeSubmit";

const FIELDS = [
  {
    marker: "01",
    label: "Jméno",
    name: "name",
    type: "text",
    placeholder: "Jan Novák",
  },
  {
    marker: "02",
    label: "Email",
    name: "email",
    type: "email",
    placeholder: "jan@firma.cz",
  },
  {
    marker: "03",
    label: "Zpráva",
    name: "message",
    type: "textarea",
    placeholder: "Řekněte nám o svém projektu…",
  },
] as const;

/**
 * Design POC A — "Číslované kroky": mirrors the numbered-chapter language
 * already used across the case-study pages (see SectionMarkerHeading) —
 * each field carries its own "01/02/03" marker instead of a generic label,
 * inputs are bare underlines (no boxes) matching the site's minimalist gold
 * accent style.
 */
export function VariantASteps() {
  const { status, handleSubmit } = useFakeSubmit();

  return (
    <section className="bg-brand-black px-6 py-24 sm:px-12 md:py-32">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-14 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
        <Reveal>
          <p className="font-body text-sm tracking-widest uppercase text-brand-gold mb-4">
            {"{ Napište nám }"}
          </p>
          <h2 className="font-display font-black uppercase text-4xl leading-[0.95] text-brand-light sm:text-5xl lg:text-6xl">
            Máte projekt?
            <br />
            Pojďme na to
          </h2>
          <p className="font-body text-brand-light/60 mt-6 max-w-sm">
            Vyplňte tři kroky níž a ozveme se vám do dvou pracovních dnů.
          </p>
        </Reveal>

        <div className="relative min-h-100">
          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex h-full flex-col justify-center gap-3"
              >
                <span className="font-display font-bold text-sm uppercase tracking-widest text-brand-gold">
                  04 Hotovo
                </span>
                <h3 className="font-display font-black uppercase text-2xl text-brand-light sm:text-3xl">
                  Děkujeme za zprávu
                </h3>
                <p className="font-body text-brand-light/60">
                  Ozveme se vám co nejdřív zpátky.
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="flex flex-col gap-8"
              >
                {FIELDS.map((field) => (
                  <div key={field.name}>
                    <label
                      htmlFor={`a-${field.name}`}
                      className="mb-2 flex items-baseline gap-3"
                    >
                      <span className="font-display font-bold text-sm text-brand-gold">
                        {field.marker}
                      </span>
                      <span className="font-body text-xs tracking-widest uppercase text-brand-light/50">
                        {field.label}
                      </span>
                    </label>
                    {field.type === "textarea" ? (
                      <textarea
                        id={`a-${field.name}`}
                        name={field.name}
                        placeholder={field.placeholder}
                        rows={5}
                        required
                        className="w-full resize-none border-b border-brand-light/20 bg-transparent py-2 font-display text-lg text-brand-light outline-none transition-colors placeholder:text-brand-light/25 focus:border-brand-gold"
                      />
                    ) : (
                      <input
                        id={`a-${field.name}`}
                        name={field.name}
                        type={field.type}
                        placeholder={field.placeholder}
                        required
                        className="w-full border-b border-brand-light/20 bg-transparent py-2 font-display text-lg text-brand-light outline-none transition-colors placeholder:text-brand-light/25 focus:border-brand-gold"
                      />
                    )}
                  </div>
                ))}

                <MagneticButton className="mt-2 self-start">
                  <BrandButton type="submit" variant="gold">
                    {status === "submitting" ? "Odesílám…" : "Odeslat"}
                  </BrandButton>
                </MagneticButton>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
