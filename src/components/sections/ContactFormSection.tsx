"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal } from "@/components/motion/Reveal";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { BrandButton } from "@/components/ui/BrandButton";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { EASE_OUT_EXPO } from "@/lib/motion";

type Props = {
  headingLine1?: string;
  headingLine2?: string;
  introText?: string;
  successMessage?: string;
};

type Status = "idle" | "submitting" | "success" | "error";
type FieldName = "name" | "email" | "message";
type Values = Record<FieldName, string>;

// Same check as /api/contact, so a "full" email clip means the server accepts it.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Characters a message needs before its clip on the timeline is full.
const MESSAGE_FULL_LENGTH = 120;

// Timecode: every typed character advances the edit by 6 frames at 25 fps.
const FPS = 25;
const FRAMES_PER_CHAR = 6;

const FIELDS = [
  {
    name: "name",
    label: "Jméno",
    type: "text",
    autoComplete: "name",
    placeholder: "Jan Novák",
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    autoComplete: "email",
    placeholder: "jan@firma.cz",
  },
  {
    name: "message",
    label: "Zpráva",
    type: "textarea",
    autoComplete: "off",
    placeholder: "Řekněte nám o svém projektu…",
  },
] as const;

// Share of the timeline each field's clip takes — the message is the "main shot".
const CLIP_WIDTHS: Record<FieldName, number> = {
  name: 0.25,
  email: 0.3,
  message: 0.45,
};

function clipProgress(values: Values): Record<FieldName, number> {
  return {
    name: values.name.trim() ? 1 : 0,
    email: EMAIL_RE.test(values.email.trim())
      ? 1
      : Math.min(values.email.length / 24, 0.6),
    message: Math.min(values.message.trim().length / MESSAGE_FULL_LENGTH, 1),
  };
}

function formatTimecode(chars: number) {
  const frames = chars * FRAMES_PER_CHAR;
  const pad = (n: number) => String(n).padStart(2, "0");
  const ff = frames % FPS;
  const totalSeconds = Math.floor(frames / FPS);
  const ss = totalSeconds % 60;
  const mm = Math.floor(totalSeconds / 60) % 60;
  const hh = Math.floor(totalSeconds / 3600);
  return `${pad(hh)}:${pad(mm)}:${pad(ss)}:${pad(ff)}`;
}

const INPUT_CLASSES =
  "w-full border-b border-brand-light/20 bg-transparent py-2 font-display text-xl text-brand-light outline-none transition-colors placeholder:text-brand-light/25 focus:border-brand-gold sm:text-2xl";

/**
 * "Timecode / Střih" contact form — the form is an edit timeline: each field
 * is a clip that fills gold as it's completed, a playhead tracks overall
 * progress and the timecode advances with every typed character (derived,
 * no running clock). Submitting is a plain "Odeslat zprávu" button — the
 * render/export wording and progress bar were dropped 2026-10-20 (Pavel).
 * Replaced the "Číslované kroky" design 2026-10-18; still a page-builder
 * block wired to POST /api/contact (Resend). `id="kontakt"` is the fixed
 * anchor SplitVideoReveal's CTA button (and anything else) links to — only
 * one instance of this block should exist per page.
 */
export function ContactFormSection({
  headingLine1 = "Řekněte nám",
  headingLine2 = "o svém projektu",
  introText = "Pár řádků stačí. Ozveme se vám do dvou pracovních dnů.",
  successMessage = "Ozveme se vám co nejdřív zpátky.",
}: Props) {
  const reduceMotion = useReducedMotion();
  const [status, setStatus] = useState<Status>("idle");
  const [values, setValues] = useState<Values>({
    name: "",
    email: "",
    message: "",
  });

  const done = status === "success";
  const progress = done
    ? { name: 1, email: 1, message: 1 }
    : clipProgress(values);
  const playhead = FIELDS.reduce(
    (sum, f) => sum + CLIP_WIDTHS[f.name] * progress[f.name],
    0,
  );
  const timecode = formatTimecode(
    values.name.length + values.email.length + values.message.length,
  );

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;

    const formData = new FormData(e.currentTarget);
    // Honeypot — real visitors never fill this (hidden via CSS below); bots
    // filling every field blindly do, and get a silent fake-success instead
    // of a hint their submission was dropped.
    if (formData.get("company")) {
      setStatus("success");
      return;
    }

    setStatus("submitting");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
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
      className="bg-brand-black pl-6 pr-6 py-24 sm:pl-24 md:pr-10 md:py-32 lg:pl-48 lg:pr-24"
    >
      {/* Same side padding + max width as HomeCtaFooter right below it. */}
      <div className="mx-auto max-w-7xl">
        {/* Edit timeline — purely decorative, the form below carries the meaning. */}
        <Reveal className="mb-16 md:mb-20">
          <div aria-hidden="true">
            <div className="mb-5 flex items-baseline justify-between gap-4">
              <p className="font-body text-sm tracking-widest uppercase text-brand-gold">
                {"{ Napište nám }"}
              </p>
              <p className="font-body text-xs tracking-widest text-brand-light/60 tabular-nums sm:text-sm">
                TC <span className="text-brand-gold">{timecode}</span>
              </p>
            </div>

            <div className="mb-2 flex gap-1">
              {FIELDS.map((field) => (
                <span
                  key={field.name}
                  style={{ flexBasis: `${CLIP_WIDTHS[field.name] * 100}%` }}
                  className={`min-w-0 truncate font-body text-[10px] tracking-widest uppercase transition-colors sm:text-xs ${
                    progress[field.name] === 1
                      ? "text-brand-gold"
                      : "text-brand-light/60"
                  }`}
                >
                  {field.label}
                </span>
              ))}
            </div>

            <div className="relative">
              <div className="flex gap-1">
                {FIELDS.map((field) => (
                  <div
                    key={field.name}
                    style={{ flexBasis: `${CLIP_WIDTHS[field.name] * 100}%` }}
                    className="h-2 min-w-0 overflow-hidden rounded-xs border border-brand-light/15"
                  >
                    <motion.div
                      className="h-full origin-left bg-brand-gold"
                      initial={false}
                      animate={{ scaleX: progress[field.name] }}
                      transition={
                        reduceMotion
                          ? { duration: 0 }
                          : { duration: 0.5, ease: EASE_OUT_EXPO }
                      }
                    />
                  </div>
                ))}
              </div>

              {/* Ruler ticks under the track */}
              <div className="mt-1.5 h-1.5 bg-[repeating-linear-gradient(to_right,var(--color-brand-light)_0_1px,transparent_1px_2.5%)] opacity-15" />

              <motion.div
                className="absolute -top-2 bottom-0 w-px bg-brand-gold"
                initial={false}
                animate={{ left: `${playhead * 100}%` }}
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : { duration: 0.5, ease: EASE_OUT_EXPO }
                }
              >
                <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-brand-gold" />
              </motion.div>
            </div>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <Reveal>
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
            <p className="sr-only" aria-live="polite">
              {status === "submitting"
                ? "Odesílám zprávu…"
                : status === "success"
                  ? "Zpráva odeslána."
                  : status === "error"
                    ? "Odeslání se nepovedlo."
                    : ""}
            </p>

            <AnimatePresence mode="wait">
              {done ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex h-full flex-col justify-center gap-3"
                >
                  <span className="font-body text-sm tracking-widest uppercase text-brand-gold">
                    Odesláno ✓
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
                  className="flex flex-col gap-10"
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
                    <div key={field.name} className="group">
                      <label
                        htmlFor={`contact-${field.name}`}
                        className="mb-1 block font-body text-xs tracking-widest uppercase text-brand-light/60 transition-colors group-focus-within:text-brand-gold"
                      >
                        {field.label}
                      </label>
                      {field.type === "textarea" ? (
                        <textarea
                          id={`contact-${field.name}`}
                          name={field.name}
                          value={values[field.name]}
                          onChange={handleChange}
                          placeholder={field.placeholder}
                          rows={4}
                          required
                          readOnly={status === "submitting"}
                          className={`${INPUT_CLASSES} resize-none`}
                        />
                      ) : (
                        <input
                          id={`contact-${field.name}`}
                          name={field.name}
                          type={field.type}
                          value={values[field.name]}
                          onChange={handleChange}
                          placeholder={field.placeholder}
                          autoComplete={field.autoComplete}
                          required
                          readOnly={status === "submitting"}
                          className={INPUT_CLASSES}
                        />
                      )}
                    </div>
                  ))}

                  {status === "error" && (
                    <p className="font-body text-sm text-red-400">
                      Zprávu se nepodařilo odeslat. Zkuste to prosím znovu, nebo
                      nám napište přímo na e-mail.
                    </p>
                  )}

                  <MagneticButton className="mt-2 self-start">
                    <BrandButton
                      type="submit"
                      variant="gold"
                      disabled={status === "submitting"}
                    >
                      {status === "submitting" ? "Odesílám…" : "Odeslat zprávu"}
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
