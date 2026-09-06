"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { urlFor } from "@/sanity/lib/image";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { SocialLinks } from "@/components/layout/SocialLinks";

// Showcase nav — just the pages this hardcoded demo actually has.
const navLinks = [
  { label: "Úvod", href: "/" },
  { label: "Reference", href: "/reference" },
  { label: "Kariéra", href: "/kariera" },
  { label: "Kontakt", href: "/kontakt" },
];

const navListVariants = {
  open: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
  closed: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
};

const navItemVariants = {
  open: { opacity: 1, x: 0 },
  closed: { opacity: 0, x: -16 },
};

type SocialLinksValue = {
  instagram?: string | null;
  linkedin?: string | null;
  facebook?: string | null;
  vimeo?: string | null;
};

type Logo = { asset: { _ref: string } };

type Props = {
  socialLinks: SocialLinksValue | null;
  logo?: Logo | null;
};

/**
 * Fixed vertical sidebar standing in for a header — hamburger menu top,
 * rotated wordmark centered, real social links (from Sanity `settings`,
 * same as the live Header/Footer) at the bottom. Stays put regardless of
 * page scroll or the hero's own scroll-driven animation underneath it.
 * The hamburger toggles a nav drawer that slides in from the left, using
 * the same real nav links as the live site's Header.
 */
export function VerticalSidebar({ socialLinks, logo }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  return (
    <>
      <header className="fixed inset-y-0 left-0 z-50 flex w-20 flex-col items-center justify-between border-r border-white/10 bg-black py-6">
        <button
          type="button"
          aria-label={isOpen ? "Zavřít menu" : "Otevřít menu"}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((open) => !open)}
          className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-white/50"
        >
          <motion.span
            className="absolute h-px w-4 bg-white"
            animate={{
              rotate: isOpen ? 45 : 0,
              y: isOpen ? 0 : -3,
            }}
            transition={{ duration: 0.25 }}
          />
          <motion.span
            className="absolute h-px w-4 bg-white"
            animate={{
              rotate: isOpen ? -45 : 0,
              y: isOpen ? 0 : 3,
            }}
            transition={{ duration: 0.25 }}
          />
        </button>

        <Link
          href="/"
          aria-label="insidePRO — domů"
          className="flex flex-1 items-center justify-center"
        >
          <div className="flex -rotate-90 flex-col items-center whitespace-nowrap">
            <span className="font-display font-black uppercase text-xl tracking-wide text-white">
              insidePRO
            </span>
            <span className="mt-1 font-body text-[10px] tracking-[0.3em] uppercase text-white/50">
              Creativity
            </span>
          </div>
        </Link>

        {socialLinks && (
          <SocialLinks
            links={socialLinks}
            iconSize={24}
            className="flex-col gap-4"
          />
        )}
      </header>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Zavřít menu"
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.2 }}
            />

            <motion.nav
              aria-label="Hlavní navigace"
              className="fixed inset-y-0 left-20 z-40 flex w-80 max-w-[80vw] flex-col justify-center gap-8 bg-brand-black px-10 py-24"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 320, damping: 32 }
              }
            >
              <motion.ul
                initial="closed"
                animate="open"
                exit="closed"
                variants={navListVariants}
                className="flex flex-col gap-2"
              >
                {navLinks.map((link) => (
                  <motion.li key={link.href} variants={navItemVariants}>
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="font-display font-black uppercase text-2xl leading-tight text-brand-light transition-colors hover:text-brand-gold"
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
