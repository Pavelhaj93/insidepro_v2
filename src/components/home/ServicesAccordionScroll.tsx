"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { manrope } from "@/lib/fonts";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Badge } from "@/components/ui/Badge";
import { SERVICES } from "./services-data";

// A row opens once its header crosses this thin horizontal band —
// positioned a bit above dead-center, per "middle of the page, or a bit
// before the middle". Expressed as a rootMargin: shrinking the viewport 42%
// from the top and 55% from the bottom leaves a band spanning 42%-45% down
// the screen. Rows are stacked with no gaps, so at most one header's box
// crosses that thin band at a time — scrolling past it opens the next row
// without affecting any row already opened earlier.
const TRIGGER_BAND_ROOT_MARGIN = "-42% 0px -55% 0px";

/**
 * All-services-at-once accordion: title + one-word subtitle stay visible by
 * default (so nothing gets missed at a glance); the full description opens
 * automatically as its row scrolls through a trigger band near the middle
 * of the viewport — no click needed. Under reduced motion, every
 * description is simply shown at once (scroll-linked reveals don't apply).
 *
 * Every row up to and including whichever one currently crosses the trigger
 * band is open — scrolling down opens more without closing rows already
 * passed, but scrolling back up closes them again in reverse as the current
 * row drops below the earlier ones.
 */
export function ServicesAccordionScroll() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const reduceMotion = useReducedMotion();
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (reduceMotion) return;

    const rows = rowRefs.current;
    const observer = new IntersectionObserver(
      (entries) => {
        const entered = entries.find((entry) => entry.isIntersecting);
        if (!entered) return;
        const index = rows.indexOf(entered.target as HTMLDivElement);
        if (index !== -1) setOpenIndex(index);
      },
      { rootMargin: TRIGGER_BAND_ROOT_MARGIN, threshold: 0 },
    );

    rows.forEach((row) => row && observer.observe(row));
    return () => observer.disconnect();
  }, [reduceMotion]);

  return (
    <section
      className={`bg-brand-black pl-6 sm:pl-24 lg:pl-48 pr-6 py-8 md:pr-10 md:py-16 lg:pr-24 ${
        reduceMotion ? "" : "relative z-10 mt-[-100vh]"
      }`}
    >
      <div className="mx-auto max-w-7xl">
        <p className="font-body text-sm tracking-widest uppercase text-brand-gold mb-4">
          {`{ Naše služby }`}
        </p>
        <h2 className="font-display font-black uppercase text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-tight text-brand-light mb-12 md:mb-16">
          Co pro vás můžeme udělat
        </h2>

        <ul className="border-t border-brand-light/15">
          {SERVICES.map((service, index) => {
            const isOpen =
              reduceMotion || (openIndex !== null && index <= openIndex);
            return (
              <li
                key={service.number}
                className="border-b border-brand-light/15"
              >
                <div
                  ref={(el) => {
                    rowRefs.current[index] = el;
                  }}
                  className="flex w-full items-center justify-between gap-4 py-10 sm:gap-6 md:py-14"
                >
                  <span className="flex items-baseline gap-3 min-w-0 md:gap-5">
                    <span className="font-display font-bold text-base text-brand-gold-light shrink-0 sm:text-lg">
                      {service.number}
                    </span>
                    <span className="flex flex-col gap-y-1 min-w-0 sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-4">
                      <span
                        className={`font-display font-black uppercase text-xl leading-none transition-colors sm:text-2xl md:text-3xl lg:text-4xl ${
                          isOpen ? "text-brand-gold" : "text-brand-light"
                        }`}
                      >
                        {service.title}
                      </span>
                      <span className="font-body text-lg text-brand-light/70 sm:text-xl">
                        {service.subtitle}
                      </span>
                    </span>
                  </span>

                  <span
                    aria-hidden
                    className={`relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full border text-brand-light transition-colors md:h-16 md:w-16 ${
                      isOpen ? "border-brand-gold" : "border-brand-light/30"
                    }`}
                  >
                    <span
                      className="absolute h-px w-5 bg-current transition-transform duration-300 md:w-6"
                      style={{
                        transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                      }}
                    />
                    <span
                      className="absolute h-px w-5 bg-current transition-transform duration-300 md:w-6"
                      style={{
                        transform: isOpen ? "rotate(45deg)" : "rotate(90deg)",
                      }}
                    />
                  </span>
                </div>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: reduceMotion ? 0 : 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-1 gap-6 pb-7 pl-0 sm:pl-9 lg:grid-cols-2 lg:gap-10 lg:pb-9 lg:pl-12">
                        <p
                          className={`${manrope.className} max-w-2xl text-base leading-6 text-brand-light/70 sm:text-lg sm:leading-7 lg:text-xl lg:leading-8`}
                        >
                          {service.description}
                        </p>
                        <div className="grid grid-cols-1 content-start gap-3 sm:grid-cols-2 sm:gap-x-4 sm:gap-y-3 lg:flex lg:flex-wrap lg:gap-3">
                          {service.keywords.map((keyword) => (
                            <Badge key={keyword}>{keyword}</Badge>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
