"use client";

import { useState, type InputHTMLAttributes } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal } from "@/components/motion/Reveal";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { BrandButton } from "@/components/ui/BrandButton";
import { useFakeSubmit } from "./useFakeSubmit";

type InlineInputProps = InputHTMLAttributes<HTMLInputElement> & {
  minChars?: number;
};

/** An input sized to its own content (native `size` attribute, in
 * characters) so it reads as a blank filled into a sentence rather than a
 * fixed-width form field. */
function InlineInput({
  minChars = 6,
  placeholder,
  ...props
}: InlineInputProps) {
  const [length, setLength] = useState(0);

  return (
    <input
      {...props}
      placeholder={placeholder}
      size={Math.max(length || placeholder?.length || 0, minChars) + 1}
      onChange={(e) => {
        setLength(e.target.value.length);
        props.onChange?.(e);
      }}
      className="mx-1 inline-block border-b-2 border-brand-gold/50 bg-transparent px-1 font-display font-black text-brand-gold outline-none transition-colors placeholder:text-brand-light/25 focus:border-brand-gold"
    />
  );
}

/**
 * Design POC B — "Mad-libs věta": the whole form is one flowing display-font
 * sentence with inline blanks instead of a stacked list of labeled fields —
 * playful and distinctive, at the cost of being a less conventional (and
 * slightly harder to skim) form pattern than A or C.
 */
export function VariantBMadlibs() {
  const { status, handleSubmit } = useFakeSubmit();

  return (
    <section className="bg-brand-black px-6 py-24 sm:px-12 md:py-32">
      <div className="mx-auto max-w-4xl text-center">
        <Reveal>
          <p className="font-body text-sm tracking-widest uppercase text-brand-gold mb-8">
            {"{ Máte projekt? Pojďme na to }"}
          </p>
        </Reveal>

        <div className="relative min-h-80">
          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex h-full flex-col items-center justify-center gap-3"
              >
                <h3 className="font-display font-black uppercase text-2xl text-brand-light sm:text-3xl">
                  Zpráva je na cestě.
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
                className="flex flex-col items-center gap-10"
              >
                <p className="font-display font-black uppercase text-2xl leading-tight text-brand-light sm:text-3xl md:text-4xl">
                  Jmenuji se{" "}
                  <InlineInput
                    name="name"
                    placeholder="Jan Novák"
                    minChars={8}
                    required
                  />
                  , řeším{" "}
                  <InlineInput
                    name="topic"
                    placeholder="nový web"
                    minChars={8}
                    required
                  />{" "}
                  a nejlíp mě zastihnete na{" "}
                  <InlineInput
                    name="email"
                    type="email"
                    placeholder="jan@firma.cz"
                    minChars={10}
                    required
                  />
                  .
                </p>

                <MagneticButton>
                  <BrandButton type="submit" variant="gold">
                    {status === "submitting" ? "Odesílám…" : "Poslat zprávu"}
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
