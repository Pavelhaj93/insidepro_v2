"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { usePathname } from "next/navigation";
import { urlFor } from "@/sanity/lib/image";
import { SocialLinks } from "./SocialLinks";

type SocialLinksValue = {
  instagram?: string | null;
  linkedin?: string | null;
  facebook?: string | null;
  vimeo?: string | null;
};

type Props = {
  logo: { asset: { _ref: string } } | null;
  logoText: string;
  socialLinks: SocialLinksValue | null;
};

const mainNavLinks = [
  { label: "FILMY", href: "/filmy" },
  { label: "PRODUKCE", href: "/produkce" },
  { label: "BRANDING", href: "/branding" },
  { label: "MARKETING", href: "/marketing" },
  { label: "KONTAKT", href: "/kontakt" },
];

const extraNavLinks = [
  { label: "PLACEHOLDER 1", href: "#" },
  { label: "PLACEHOLDER 2", href: "#" },
];

export function Header({ logo, logoText, socialLinks }: Props) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const { scrollY, scrollYProgress } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 20);
  });

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 z-60 h-0.5 bg-brand-gold origin-left"
        style={{ scaleX: scrollYProgress }}
      />
      <header className="fixed top-0 left-0 right-0 z-50 px-8 py-5 md:px-12">
        <AnimatePresence>
          {scrolled && (
            <motion.div
              key="header-bg"
              className="absolute inset-0 -z-10 bg-black/90 backdrop-blur-md"
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            />
          )}
        </AnimatePresence>
        <div className="max-w-7xl mx-auto flex items-center justify-between relative">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            {logo ? (
              <Image
                src={urlFor(logo).height(40).url()}
                alt="insidePRO"
                width={80}
                height={40}
                className="h-8 w-auto object-contain"
              />
            ) : (
              <span className="font-display font-bold text-lg tracking-widest text-brand-light">
                {logoText}
              </span>
            )}
          </Link>

          {/* Desktop center nav */}
          <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {mainNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`group relative font-display font-black text-sm leading-none tracking-normal transition-colors uppercase ${
                  pathname === link.href
                    ? "text-brand-gold"
                    : "text-brand-light/80 hover:text-brand-light"
                }`}
              >
                {link.label}
                <span
                  className={`absolute left-0 -bottom-1 h-px w-full bg-brand-gold origin-left transition-transform duration-300 ${
                    pathname === link.href
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            ))}
          </nav>

          {/* Animated menu toggle */}
          <motion.button
            className="relative h-12 w-12 cursor-pointer"
            onClick={() => setOpen((prev) => !prev)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="site-menu-panel"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            animate={open ? "open" : "closed"}
            initial="closed"
          >
            <svg
              width="22"
              height="18"
              viewBox="0 0 22 18"
              fill="none"
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              {/* Top line → diagonal \ */}
              <motion.path
                strokeWidth="1.5"
                strokeLinecap="round"
                variants={{
                  closed: { d: "M 0 1 L 22 1", stroke: "#F0F4FF" },
                  open: { d: "M 2 0 L 20 18", stroke: "#F5CCA2" },
                }}
                transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
              />
              {/* Middle line → fades out */}
              <motion.path
                d="M 0 9 L 16 9"
                strokeWidth="1.5"
                strokeLinecap="round"
                variants={{
                  closed: { opacity: 1, stroke: "rgba(240,244,255,0.65)" },
                  open: { opacity: 0, stroke: "rgba(245,204,162,0.65)" },
                }}
                transition={{ duration: 0.18 }}
              />
              {/* Bottom line → diagonal / */}
              <motion.path
                strokeWidth="1.5"
                strokeLinecap="round"
                variants={{
                  closed: { d: "M 0 17 L 22 17", stroke: "#F0F4FF" },
                  open: { d: "M 2 18 L 20 0", stroke: "#F5CCA2" },
                }}
                transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
              />
            </svg>
          </motion.button>
        </div>
      </header>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/60 transition-opacity duration-300  ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* Slide panel */}
      <div
        id="site-menu-panel"
        className={`fixed top-0 right-0 z-50 h-full w-80 bg-brand-black flex flex-col transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Close button */}
        <div className="flex justify-end px-8 py-6">
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="text-brand-light/60 hover:text-brand-light transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M2 2l16 16M18 2L2 18"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col px-10 flex-1">
          {mainNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`font-display font-bold text-2xl transition-colors uppercase py-3 border-b border-brand-dark/50 last:border-0 ${
                pathname === link.href
                  ? "text-brand-gold"
                  : "text-brand-light/80 hover:text-brand-light"
              }`}
            >
              {link.label}
            </Link>
          ))}

          <div className="mt-8 pt-8 border-t border-brand-dark flex flex-col">
            {extraNavLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="font-body text-sm tracking-widest text-brand-light/50 hover:text-brand-light transition-colors uppercase py-2"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>

        {/* Social links */}
        {socialLinks && (
          <div className="px-10 py-8">
            <SocialLinks links={socialLinks} iconSize={18} />
          </div>
        )}
      </div>
    </>
  );
}
