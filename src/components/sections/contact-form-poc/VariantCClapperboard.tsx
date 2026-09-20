"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Reveal } from "@/components/motion/Reveal";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { BrandButton } from "@/components/ui/BrandButton";
import { useFakeSubmit } from "./useFakeSubmit";

const FIELDS = [
  {
    scene: "SCÉNA 01",
    label: "Jméno",
    name: "name",
    type: "text",
    placeholder: "Jan Novák",
  },
  {
    scene: "SCÉNA 02",
    label: "Email",
    name: "email",
    type: "email",
    placeholder: "jan@firma.cz",
  },
  {
    scene: "POZNÁMKA",
    label: "Zpráva",
    name: "message",
    type: "textarea",
    placeholder: "O čem natočíme příběh?",
  },
] as const;

/**
 * Design POC C — "Filmová klapka": leans hardest into the fact that this is
 * a film production company specifically (not just "a creative agency"),
 * with a clapperboard-striped header bar and shot-list-style field labels.
 * Most thematic of the three, at the cost of being the most opinionated —
 * a client who isn't already sold on the film-set framing may read it as
 * gimmicky rather than distinctive.
 */
export function VariantCClapperboard() {
  const { status, handleSubmit } = useFakeSubmit();

  const stripes = {
    backgroundImage:
      "repeating-linear-gradient(135deg, var(--color-brand-gold) 0 24px, var(--color-brand-black) 24px 48px)",
  };

  return (
    <section className="bg-brand-black px-6 py-24 sm:px-12 md:py-32">
      <div className="mx-auto max-w-2xl overflow-hidden rounded-2xl border border-brand-light/10 bg-brand-grey">
        <div className="h-4" style={stripes} aria-hidden="true" />

        <div className="p-8 sm:p-12">
          <Reveal>
            <p className="font-body text-xs tracking-widest uppercase text-brand-gold mb-2">
              insidePRO productions
            </p>
            <h2 className="font-display font-black uppercase text-3xl leading-none text-brand-light sm:text-4xl">
              Máte projekt?
              <br />
              Pojďme na to
            </h2>
          </Reveal>

          <div className="relative mt-10 min-h-90">
            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex h-full flex-col justify-center gap-3"
                >
                  <p className="font-body text-xs tracking-widest uppercase text-brand-gold">
                    STŘIH
                  </p>
                  <h3 className="font-display font-black uppercase text-2xl text-brand-light">
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
                  className="flex flex-col gap-7"
                >
                  {FIELDS.map((field) => (
                    <div key={field.name}>
                      <label
                        htmlFor={`c-${field.name}`}
                        className="mb-2 flex flex-wrap items-baseline gap-x-2"
                      >
                        <span className="font-display font-bold text-xs uppercase tracking-widest text-brand-gold">
                          {field.scene}
                        </span>
                        <span className="font-body text-xs tracking-widest uppercase text-brand-light/50">
                          — {field.label}
                        </span>
                      </label>
                      {field.type === "textarea" ? (
                        <textarea
                          id={`c-${field.name}`}
                          name={field.name}
                          placeholder={field.placeholder}
                          rows={2}
                          required
                          className="w-full resize-none rounded-md border border-brand-light/15 bg-brand-black px-4 py-3 font-body text-brand-light outline-none transition-colors placeholder:text-brand-light/25 focus:border-brand-gold"
                        />
                      ) : (
                        <input
                          id={`c-${field.name}`}
                          name={field.name}
                          type={field.type}
                          placeholder={field.placeholder}
                          required
                          className="w-full rounded-md border border-brand-light/15 bg-brand-black px-4 py-3 font-body text-brand-light outline-none transition-colors placeholder:text-brand-light/25 focus:border-brand-gold"
                        />
                      )}
                    </div>
                  ))}

                  <MagneticButton className="mt-2 self-start">
                    <BrandButton type="submit" variant="gold">
                      {status === "submitting" ? "Natáčíme…" : "AKCE!"}
                    </BrandButton>
                  </MagneticButton>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
