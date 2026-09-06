"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { manrope } from "@/lib/fonts";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Badge } from "@/components/ui/Badge";
import { SERVICES, type Service } from "./services-data";

type ServiceRowProps = {
  service: Service;
  isOpen: boolean;
  onToggle: () => void;
  reduceMotion: boolean;
};

/** One accordion row. */
function ServiceRow({
  service,
  isOpen,
  onToggle,
  reduceMotion,
}: ServiceRowProps) {
  return (
    <li className="border-b border-brand-light/15">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="group flex w-full cursor-pointer items-start justify-between gap-4 py-10 text-left transition-colors sm:gap-6 md:py-14 hover:bg-brand-light/3"
      >
        <span className="flex items-start gap-3 min-w-0 md:gap-5">
          <span className="font-display font-bold text-base text-brand-gold-light shrink-0 sm:text-lg">
            {service.number}
          </span>
          <span className="flex flex-col gap-4 min-w-0">
            <span className="flex flex-col gap-y-1 sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-4">
              <span
                className={`font-display font-black uppercase text-lg leading-none transition-colors sm:text-xl md:text-2xl lg:text-3xl ${
                  isOpen
                    ? "text-brand-gold"
                    : "text-brand-light group-hover:text-brand-gold"
                }`}
              >
                {service.title}
              </span>
              <span className="font-body text-base text-brand-light/70 sm:text-lg">
                {service.subtitle}
              </span>
            </span>

            <span className="flex flex-wrap gap-3">
              {service.keywords.map((keyword) => (
                <Badge key={keyword}>{keyword}</Badge>
              ))}
            </span>
          </span>
        </span>

        <span
          aria-hidden
          className={`relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full border text-brand-light transition-colors md:h-16 md:w-16 ${
            isOpen
              ? "border-brand-gold"
              : "border-brand-light/30 group-hover:border-brand-gold"
          }`}
        >
          <span
            className="absolute h-px w-5 bg-current transition-transform duration-300 md:w-6"
            style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
          />
          <span
            className="absolute h-px w-5 bg-current transition-transform duration-300 md:w-6"
            style={{ transform: isOpen ? "rotate(45deg)" : "rotate(90deg)" }}
          />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.3 }}
            className="overflow-hidden"
          >
            <p
              className={`${manrope.className} max-w-2xl pb-10 pl-0 text-lg leading-7 text-brand-light/70 sm:pl-9 md:pb-14 md:pl-12`}
            >
              {service.description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

/**
 * Title + subtitle + keyword badges are all visible immediately for every
 * service, no interaction needed — so the full offering reads at a glance.
 * Only the longer description sentence is gated behind a click, since it's
 * genuinely optional depth rather than something visitors shouldn't miss.
 * Single-open accordion — opening one row closes whichever was open before.
 */
export function ServicesAccordionClick() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const reduceMotion = useReducedMotion();

  return (
    <section
      className={`bg-brand-black pl-24 lg:pl-48 pr-6 py-8 md:pr-10 md:py-16 lg:pr-24 ${
        reduceMotion ? "" : "relative z-10 mt-[-100vh]"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <p className="font-body text-sm tracking-widest uppercase text-brand-gold mb-4">
          {`{ Naše služby }`}
        </p>
        <h2 className="font-display font-black uppercase text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-tight text-brand-light mb-12 md:mb-16">
          Co pro vás můžeme udělat
        </h2>

        <ul className="border-t border-brand-light/15">
          {SERVICES.map((service, index) => (
            <ServiceRow
              key={service.number}
              service={service}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
              reduceMotion={reduceMotion}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}
