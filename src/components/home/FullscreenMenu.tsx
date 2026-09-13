"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { MenuNavLink, type MenuEffect } from "./MenuNavLink";
import { MenuSpotlightList } from "./MenuSpotlightList";

const navListVariants = {
  open: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
  closed: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
};

const navItemVariants = {
  open: { opacity: 1, x: 0 },
  closed: { opacity: 0, x: -16 },
};

type NavLink = { label: string; href: string; translatedLabel?: string };

type Props = {
  isOpen: boolean;
  onClose: () => void;
  navLinks: NavLink[];
};

const EFFECTS: MenuEffect[] = ["gradient", "wave", "glitch", "wipe", "spotlight"];

export function FullscreenMenu({ isOpen, onClose, navLinks }: Props) {
  const [effect, setEffect] = useState<MenuEffect>("gradient");
  const reduceMotion = useReducedMotion();

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
          className="fixed inset-y-0 left-20 right-0 z-40 flex flex-col items-center justify-center gap-6 bg-brand-black px-6 py-20 sm:gap-8 sm:px-10 md:py-24"
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { type: "spring", stiffness: 320, damping: 32 }
          }
        >
          {effect === "spotlight" ? (
            <MenuSpotlightList
              navLinks={navLinks}
              onNavigate={onClose}
              reduceMotion={reduceMotion}
            />
          ) : (
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
                    effect={effect}
                    reduceMotion={reduceMotion}
                    onNavigate={onClose}
                  />
                </motion.li>
              ))}
            </motion.ul>
          )}

          {process.env.NODE_ENV === "development" && (
            <div className="fixed bottom-6 right-6 z-50 flex gap-2">
              {EFFECTS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEffect(e)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-[10px] uppercase tracking-widest transition-colors",
                    effect === e
                      ? "border-brand-gold text-brand-gold"
                      : "border-white/20 text-white/50 hover:text-white"
                  )}
                >
                  {e}
                </button>
              ))}
            </div>
          )}
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
