"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { manrope } from "@/lib/fonts";
import { ZoomTextTransition } from "@/components/motion/ZoomTextTransition";
import {
  PinnedScrollStack,
  type PinnedStackRenderArgs,
} from "@/components/motion/PinnedScrollStack";
import {
  HorizontalScrollCards,
  type HorizontalCardRenderArgs,
} from "@/components/motion/HorizontalScrollCards";
import {
  StickyListReveal,
  type StickyListRevealRenderArgs,
} from "@/components/motion/StickyListReveal";

/**
 * Standalone POC route — not linked from any nav, not backed by Sanity.
 * Visit locally at /poc/scroll-effects. See the scroll-effects POC plan
 * for what this demonstrates and what happens if it gets adopted.
 */

type ServiceSlide = {
  name: string;
  tagline: string;
  description: string;
  accent: string;
};

const SERVICE_SLIDES: ServiceSlide[] = [
  {
    name: "PRODUKCE",
    tagline: "Audiovizuální tvorba",
    description:
      "Od nápadu po výstup — kompletní produkce videí a fotografií, která vaši značku ukáže tak, jak si zaslouží.",
    accent: "var(--color-brand-bronze)",
  },
  {
    name: "BRANDING",
    tagline: "Vizuální identita",
    description:
      "Identita, kterou poznáte na první pohled — systém, který dává všemu smysl, vizuálně i strategicky.",
    accent: "var(--color-brand-gold-light)",
  },
  {
    name: "MARKETING",
    tagline: "Strategická komunikace",
    description:
      "Kampaně postavené na strategii, které dostanou vaši značku k lidem, kteří ji hledají.",
    accent: "var(--color-brand-dark)",
  },
];

type ServiceListItem = {
  number: string;
  title: string;
  description: string;
};

const SERVICE_LIST_ITEMS: ServiceListItem[] = [
  {
    number: "01",
    title: "Produkce",
    description:
      "Od nápadu po výstup — kompletní produkce videí a fotografií, která vaši značku ukáže tak, jak si zaslouží.",
  },
  {
    number: "02",
    title: "Branding",
    description:
      "Identita, kterou poznáte na první pohled — systém, který dává všemu smysl, vizuálně i strategicky.",
  },
  {
    number: "03",
    title: "Marketing",
    description:
      "Kampaně postavené na strategii, které dostanou vaši značku k lidem, kteří ji hledají.",
  },
];

type ProcessStep = {
  number: string;
  title: string;
  description: string;
};

const PROCESS_STEPS: ProcessStep[] = [
  {
    number: "01",
    title: "Brief & strategie",
    description: "Poznáme váš byznys a cíle, než natočíme jediný záběr.",
  },
  {
    number: "02",
    title: "Koncept & scénář",
    description:
      "Najdeme příběh, který se bude chtít sledovat od začátku do konce.",
  },
  {
    number: "03",
    title: "Produkce",
    description: "Natočíme a nafotíme s týmem, který ví, co dělá.",
  },
  {
    number: "04",
    title: "Postprodukce & dodání",
    description: "Sestřih, grading, zvuk — a hotový výstup ve vašich rukou.",
  },
];

function renderServiceSlide({
  item,
  depthScale,
}: PinnedStackRenderArgs<ServiceSlide>) {
  return (
    <div className="h-full w-full px-4 md:px-10 pt-28 pb-20 md:pb-10">
      <motion.div
        className="relative h-full w-full rounded-3xl overflow-hidden"
        style={{ scale: depthScale }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${item.accent}, var(--color-brand-black))`,
          }}
        />
        <div className="absolute top-1/2 right-6 md:right-10 -translate-y-1/2 w-[calc(100%-3rem)] md:w-[38%] bg-[#0D0D0D] flex flex-col justify-between p-8 md:p-10 rounded-3xl">
          <div>
            <p className="font-display font-black text-2xl md:text-3xl uppercase text-brand-light mb-4">
              {item.name}
            </p>
            <p
              className={`${manrope.className} text-lg leading-7 text-brand-light/90`}
            >
              {item.description}
            </p>
          </div>
          <div className="mt-8">
            <div className="h-px bg-brand-gold mb-4" />
            <p className="font-display font-black text-xs uppercase tracking-widest text-brand-light/50">
              {item.tagline}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function renderServiceListItem({
  item,
  y,
  opacity,
}: StickyListRevealRenderArgs<ServiceListItem>) {
  return (
    <motion.div
      className="border-t border-brand-dark/60 pt-8"
      style={{ y, opacity }}
    >
      <span className="font-display font-bold text-4xl sm:text-5xl text-brand-gold-light block mb-6">
        {item.number}
      </span>
      <h3 className="font-display font-black leading-8 text-2xl uppercase text-brand-light mb-3">
        {item.title}
      </h3>
      <p
        className={`${manrope.className} text-lg leading-7 text-brand-light/80`}
      >
        {item.description}
      </p>
    </motion.div>
  );
}

function renderProcessCard({
  item,
  depthScale,
  depthOpacity,
}: HorizontalCardRenderArgs<ProcessStep>) {
  return (
    <motion.div
      className="h-full border border-brand-dark/60 bg-brand-grey rounded-md p-6 md:p-8 flex flex-col justify-between"
      style={{ scale: depthScale, opacity: depthOpacity }}
    >
      <span className="font-display font-bold text-5xl md:text-7xl text-brand-gold-light block mb-16">
        {item.number}
      </span>
      <div>
        <h3 className="font-display font-black text-xl md:text-2xl uppercase text-brand-light mb-3">
          {item.title}
        </h3>
        <p
          className={`${manrope.className} text-base md:text-lg leading-7 text-brand-light/80`}
        >
          {item.description}
        </p>
      </div>
    </motion.div>
  );
}

export default function ScrollEffectsPocPage() {
  return (
    <main className="bg-brand-black text-brand-light">
      <section className="min-h-[70vh] flex flex-col items-center justify-center text-center px-8 gap-6">
        <p className="font-body text-sm tracking-widest uppercase text-brand-gold">
          Scroll Effects — Proof of Concept
        </p>
        <h1 className="font-display font-black uppercase text-4xl sm:text-5xl md:text-6xl leading-tight max-w-4xl">
          Toto je hřiště, ne live web
        </h1>
        <p
          className={`${manrope.className} max-w-xl text-brand-light/70 text-lg`}
        >
          Scrolluj dolů — každá sekce níž je mock, žádný obsah není napojený na
          Sanity.
        </p>
      </section>

      <ZoomTextTransition
        label="Scroll efekt"
        headline="PŘÍBĚH, KTERÝ VÁS POHLTÍ"
        accentColor="var(--color-brand-gold)"
      />

      <PinnedScrollStack
        items={SERVICE_SLIDES}
        itemKey={(item) => item.name}
        label={
          <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl lg:text-7xl leading-tight uppercase text-brand-light mt-2">
            Co děláme
          </h2>
        }
        renderItem={renderServiceSlide}
      />

      <section className="px-8 xl:px-0 pt-24 pb-24 bg-black">
        <div className="max-w-7xl mx-auto">
          <StickyListReveal
            items={SERVICE_LIST_ITEMS}
            itemKey={(item) => item.number}
            gapVh={50}
            sticky={
              <div className="max-w-md">
                <p className="font-body text-lg text-brand-gold tracking-widest uppercase font-medium mb-6">
                  Naše služby
                </p>
                <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl leading-tight uppercase text-brand-light">
                  Vše, co potřebuje vaše značka na jednom místě
                </h2>
              </div>
            }
            renderItem={renderServiceListItem}
          />
        </div>
      </section>

      <section className="px-8 xl:px-0 pt-24 pb-8 bg-black">
        <p className="max-w-7xl mx-auto font-body text-lg text-brand-gold tracking-widest uppercase font-medium">
          Jak pracujeme
        </p>
      </section>
      <HorizontalScrollCards
        items={PROCESS_STEPS}
        itemKey={(item) => item.number}
        renderItem={renderProcessCard}
      />

      <section className="py-32 md:py-48 px-8 text-center bg-brand-dark">
        <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl uppercase leading-none text-brand-light mb-8">
          Líbí se vám to?
        </h2>
        <p className={`${manrope.className} text-brand-light/70 mb-8`}>
          Mock CTA — žádný Sanity obsah, jen ukázka handoffu na další scénu.
        </p>
        <Link
          href="/"
          className="inline-block font-body text-sm tracking-widest uppercase px-8 py-4 border border-brand-light text-brand-light hover:bg-brand-light hover:text-brand-black transition-colors"
        >
          Zpět na web
        </Link>
      </section>
    </main>
  );
}
