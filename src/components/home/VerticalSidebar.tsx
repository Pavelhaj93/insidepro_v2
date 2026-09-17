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
  { label: "Filmy", href: "/filmy" },
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

function HamburgerButton({
  isOpen,
  onToggle,
}: {
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={isOpen ? "Zavřít menu" : "Otevřít menu"}
      aria-expanded={isOpen}
      onClick={onToggle}
      className="relative flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-black/20 bg-white text-black transition-colors hover:border-black/50"
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
  );
}

/**
 * Header, standing in for a live site's Header/nav. Two CSS-switched
 * layouts (no JS breakpoint check, so no hydration risk) sharing one
 * `isOpen` state and one `<FullscreenMenu>`:
 * - `sm:` and up (tablet/desktop): fixed vertical sidebar on the left —
 *   hamburger top, rotated wordmark centered, social links at the bottom.
 * - below `sm` (mobile): fixed horizontal bar on top — wordmark left,
 *   hamburger right, no social links (those move into the fullscreen menu
 *   itself on mobile, see FullscreenMenu).
 */
export function VerticalSidebar({ socialLinks, logo }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen((open) => !open);

  return (
    <>
      <header className="fixed inset-y-0 left-0 z-50 hidden w-20 flex-col items-center justify-between border-r border-white/10 bg-black py-6 sm:flex">
        <HamburgerButton isOpen={isOpen} onToggle={toggle} />

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

      <header className="fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between border-b border-white/10 bg-black px-5 sm:hidden">
        <Link href="/" aria-label="insidePRO — domů" className="flex items-center">
          <span className="font-display font-black uppercase text-lg tracking-wide text-white">
            inside<span className="text-xl">PRO</span>
          </span>
        </Link>

        <HamburgerButton isOpen={isOpen} onToggle={toggle} />
      </header>

      <FullscreenMenu
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        navLinks={navLinks}
        socialLinks={socialLinks}
      />
    </>
  );
}
