"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { SocialLinks } from "@/components/layout/SocialLinks";
import { FullscreenMenu } from "./FullscreenMenu";

// Showcase nav — just the pages this hardcoded demo actually has. The
// category links reuse the Reference page's own filter (matched by
// category slug, see ReferenceWorksSection) instead of linking to their
// separate (currently unused) standalone pages — only Filmy gets its own
// page.
const navLinks = [
  { label: "Úvod", href: "/" },
  { label: "Reference", href: "/reference" },
  { label: "Branding", href: "/reference?category=branding" },
  { label: "Marketing", href: "/reference?category=marketing" },
  { label: "Filmy", href: "/filmy" },
  { label: "Produkce", href: "/reference?category=produkce" },
  { label: "Weby", href: "/reference?category=web" },
  { label: "Kariéra", href: "/kariera" },
  { label: "Kontakt", href: "/kontakt" },
];

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

  return (
    <>
      <header className="fixed inset-y-0 left-0 z-50 flex w-20 flex-col items-center justify-between border-r border-white/10 bg-black py-6">
        <button
          type="button"
          aria-label={isOpen ? "Zavřít menu" : "Otevřít menu"}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((open) => !open)}
          className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-black/20 bg-white text-black transition-colors hover:border-black/50"
        >
          <motion.span
            className="absolute h-px w-4 bg-black"
            animate={{
              rotate: isOpen ? 45 : 0,
              y: isOpen ? 0 : -3,
            }}
            transition={{ duration: 0.25 }}
          />
          <motion.span
            className="absolute h-px w-4 bg-black"
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
              inside<span className="text-2xl">PRO</span>
            </span>
            <span className="mt-1 font-body text-[10px] tracking-[0.3em] uppercase text-white/50">
              Creative studio
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

      <FullscreenMenu
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        navLinks={navLinks}
      />
    </>
  );
}
