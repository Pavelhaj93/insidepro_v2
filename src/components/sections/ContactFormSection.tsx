"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal } from "@/components/motion/Reveal";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { BrandButton } from "@/components/ui/BrandButton";

type Props = {
  headingLine1?: string;
  headingLine2?: string;
  introText?: string;
  successMessage?: string;
};

type Status = "idle" | "submitting" | "success" | "error";

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
 * "Číslované kroky" contact form — the picked design of three POC variants
 * (see src/components/sections/contact-form-poc/), promoted to a real
 * page-builder block wired to POST /api/contact (Resend). `id="kontakt"` is
 * the fixed anchor SplitVideoReveal's CTA button (and anything else) links
 * to — only one instance of this block should exist per page.
 */
export function ContactFormSection({
  headingLine1 = "Máte projekt?",
  headingLine2 = "Pojďme na to",
  introText = "Vyplňte tři kroky níž a ozveme se vám do dvou pracovních dnů.",
  successMessage = "Ozveme se vám co nejdřív zpátky.",
}: Props) {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");

    const formData = new FormData(e.currentTarget);
    // Honeypot — real visitors never fill this (hidden via CSS below); bots
    // filling every field blindly do, and get a silent fake-success instead
    // of a hint their submission was dropped.
    if (formData.get("company")) {
      setStatus("success");
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          message: formData.get("message"),
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section
      id="kontakt"
      className="bg-brand-black px-6 py-24 sm:px-12 md:py-32"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-14 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
        <Reveal>
          <p className="font-body text-sm tracking-widest uppercase text-brand-gold mb-4">
            {"{ Napište nám }"}
          </p>
          <h2 className="font-display font-black uppercase text-4xl leading-[0.95] text-brand-light sm:text-5xl lg:text-6xl">
            {headingLine1}
            <br />
            {headingLine2}
          </h2>
          {introText && (
            <p className="font-body text-brand-light/60 mt-6 max-w-sm">
              {introText}
            </p>
          )}
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
                  {successMessage}
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
                {/* Honeypot — hidden from sighted/keyboard users, still in the
                    tab/DOM order for naive bots that fill every field. */}
                <input
                  type="text"
                  name="company"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute -left-full h-0 w-0 opacity-0"
                />

                {FIELDS.map((field) => (
                  <div key={field.name}>
                    <label
                      htmlFor={`contact-${field.name}`}
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
                        id={`contact-${field.name}`}
                        name={field.name}
                        placeholder={field.placeholder}
                        rows={5}
                        required
                        className="w-full resize-none border-b border-brand-light/20 bg-transparent py-2 font-display text-lg text-brand-light outline-none transition-colors placeholder:text-brand-light/25 focus:border-brand-gold"
                      />
                    ) : (
                      <input
                        id={`contact-${field.name}`}
                        name={field.name}
                        type={field.type}
                        placeholder={field.placeholder}
                        required
                        className="w-full border-b border-brand-light/20 bg-transparent py-2 font-display text-lg text-brand-light outline-none transition-colors placeholder:text-brand-light/25 focus:border-brand-gold"
                      />
                    )}
                  </div>
                ))}

                {status === "error" && (
                  <p className="font-body text-sm text-red-400">
                    Něco se nepovedlo. Zkuste to prosím znovu, nebo nám napište
                    přímo na e-mail.
                  </p>
                )}

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
