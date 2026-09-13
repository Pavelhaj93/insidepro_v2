"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useIsMobile } from "@/hooks/useIsMobile";
import { SocialLinks } from "@/components/layout/SocialLinks";
import { MenuNavLink } from "./MenuNavLink";

const navListVariants = {
  open: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
  closed: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
};

const navItemVariants = {
  open: { opacity: 1, x: 0 },
  closed: { opacity: 0, x: -16 },
};

type NavLink = { label: string; href: string };

type SocialLinksValue = {
  instagram?: string | null;
  linkedin?: string | null;
  facebook?: string | null;
  vimeo?: string | null;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  navLinks: NavLink[];
  socialLinks?: SocialLinksValue | null;
};

export function FullscreenMenu({ isOpen, onClose, navLinks, socialLinks }: Props) {
  const reduceMotion = useReducedMotion();
  // Slide direction/position differ enough (top-bar-less full overlay vs.
  // offset-from-sidebar panel) that this needs a real JS check, not just
  // responsive classes — see useIsMobile's own doc comment.
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.nav
          aria-label="Hlavní navigace"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
          className={cn(
            "fixed z-40 flex flex-col items-center gap-6 bg-brand-black px-6 py-20 sm:gap-8 sm:px-10 md:py-24",
            isMobile
              ? "inset-0 justify-center"
              : "inset-y-0 left-20 right-0 justify-center"
          )}
          initial={isMobile ? { y: "-100%" } : { x: "-100%" }}
          animate={isMobile ? { y: 0 } : { x: 0 }}
          exit={isMobile ? { y: "-100%" } : { x: "-100%" }}
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
            className="flex flex-col items-center gap-2 text-center sm:gap-3 md:gap-4"
          >
            {navLinks.map((link) => (
              <motion.li key={link.href} variants={navItemVariants}>
                <MenuNavLink
                  label={link.label}
                  href={link.href}
                  reduceMotion={reduceMotion}
                  onNavigate={onClose}
                />
              </motion.li>
            ))}
          </motion.ul>

          {/* No room for social links in the mobile top bar (see
              VerticalSidebar) — they live here instead, below the nav
              links, on mobile only. Tablet/desktop keep them in the
              vertical sidebar, so hidden there to avoid showing twice. */}
          {socialLinks && (
            <SocialLinks links={socialLinks} iconSize={22} className="mt-8 sm:hidden" />
          )}
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
