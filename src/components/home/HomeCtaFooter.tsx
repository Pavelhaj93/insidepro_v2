"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { sanityImageLoader, urlFor } from "@/sanity/lib/image";
import { Reveal, RevealItem, RevealStagger } from "@/components/motion/Reveal";
import { SocialLinks } from "@/components/layout/SocialLinks";
import { MapPinIcon } from "@/components/icons/MapPin";
import { NAV_LINKS, type NavLink } from "@/lib/nav-links";

type SocialLinksValue = {
  instagram?: string | null;
  linkedin?: string | null;
  facebook?: string | null;
  vimeo?: string | null;
};

type Logo = { asset: { _ref: string }; lqip?: string };

type Props = {
  logo?: Logo | null;
  logoText?: string | null;
  headingLine1?: string | null;
  headingLine2?: string | null;
  email?: string | null;
  phone?: string | null;
  socialLinks?: SocialLinksValue | null;
  navLinks?: NavLink[];
  copyrightText?: string | null;
  legalText?: string | null;
};

/**
 * Site-wide footer, rendered once from the root layout so it appears on
 * every page. White-on-black... rather, white background/black text on the
 * homepage (a deliberate "we've arrived" closing beat after the also-
 * inverted team section), and inverted — the site's usual dark palette —
 * everywhere else, so it doesn't clash with other pages' dark theme.
 * Self-detects which via the current route rather than taking a prop, since
 * it's mounted once in the layout for every route.
 */
export function HomeCtaFooter({
  logo,
  logoText,
  headingLine1 = "Máte projekt?",
  headingLine2 = "Pojďme na to",
  email,
  phone,
  socialLinks,
  navLinks = NAV_LINKS,
  copyrightText,
  legalText,
}: Props) {
  const pathname = usePathname();
  const invert = pathname !== "/";

  const bgClass = invert
    ? "bg-brand-black text-brand-light"
    : "bg-brand-light text-brand-black";
  const borderClass = invert
    ? "border-brand-light/15"
    : "border-brand-black/15";
  const labelClass = invert ? "text-brand-light/50" : "text-brand-black/50";
  const linkClass = invert ? "text-brand-light" : "text-brand-black";
  const legalClass = invert ? "text-brand-light/40" : "text-brand-black/40";

  return (
    <footer
      id="home-cta-footer"
      className={`${bgClass} pl-6 pr-6 pt-16 pb-8 sm:pl-24 sm:pt-20 sm:pb-10 md:pr-10 md:pt-28 md:pb-12 lg:pl-48 lg:pr-24`}
    >
      <div className="max-w-7xl mx-auto">
        <Reveal>
          <h2 className="font-display font-black uppercase text-3xl leading-[0.95] tracking-normal sm:text-4xl md:text-6xl lg:text-7xl">
            {headingLine1}
            <br />
            {headingLine2}
          </h2>

          <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center sm:gap-6">
            <div className="flex items-center gap-4">
              <span className={`flex items-center gap-1.5 ${linkClass}`}>
                <MapPinIcon className="h-3.5 w-3.5 shrink-0" />
                <span className="font-body text-sm font-bold uppercase tracking-wide">
                  Hradec Králové
                </span>
              </span>
              <span className={`flex items-center gap-1.5 ${linkClass}`}>
                <MapPinIcon className="h-3.5 w-3.5 shrink-0" />
                <span className="font-body text-sm font-bold uppercase tracking-wide">
                  Praha
                </span>
              </span>
            </div>
            <p className={`font-body text-sm ${labelClass}`}>
              Působíme po celé České republice
            </p>
          </div>
        </Reveal>

        <RevealStagger
          className={`grid grid-cols-1 gap-10 mt-16 pt-10 border-t ${borderClass} sm:mt-20 sm:grid-cols-2 lg:grid-cols-3`}
        >
          <RevealItem>
            <p
              className={`font-body text-xs tracking-widest uppercase ${labelClass} mb-4`}
            >
              Stránky
            </p>
            <ul className="flex flex-col gap-2">
              {/* links filtered by isDisabled flag, it should map and when it is isDisabled, render nonclickable text */}

              {navLinks.map((link) => (
                <li key={link.href}>
                  {link.isDisabled ? (
                    <span
                      className={`font-display font-bold text-lg uppercase ${linkClass} text-gray-400 cursor-not-allowed`}
                    >
                      {link.label}
                    </span>
                  ) : (
                    <Link
                      href={link.href}
                      className={`font-display font-bold text-lg uppercase ${linkClass} hover:text-brand-gold transition-colors`}
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </RevealItem>

          <RevealItem>
            <p
              className={`font-body text-xs tracking-widest uppercase ${labelClass} mb-4`}
            >
              Kontakt
            </p>
            <div className="flex flex-col gap-2">
              {email && (
                <a
                  href={`mailto:${email}`}
                  className={`font-display font-bold text-lg uppercase ${linkClass} hover:text-brand-gold transition-colors break-all`}
                >
                  {email}
                </a>
              )}
              {phone && (
                <a
                  href={`tel:${phone.replace(/\s+/g, "")}`}
                  className={`font-display font-bold text-lg uppercase ${linkClass} hover:text-brand-gold transition-colors`}
                >
                  {phone}
                </a>
              )}
            </div>
          </RevealItem>

          <RevealItem className="flex h-full flex-col">
            <p
              className={`font-body text-xs tracking-widest uppercase ${labelClass} mb-4`}
            >
              Sledujte nás
            </p>
            {socialLinks && (
              <SocialLinks
                links={socialLinks}
                iconSize={22}
                linkClassName={`${linkClass} hover:text-brand-gold`}
              />
            )}

            {/* Bottom-right of this last column on desktop (this column's
                own height stretches to match its siblings); directly under
                the social icons on mobile, where columns stack. */}
            <div className="mt-8 flex justify-end lg:mt-auto">
              {logo ? (
                <Image
                  src={urlFor(logo).url()}
                  loader={sanityImageLoader}
                  alt={logoText ?? "insidePRO"}
                  width={160}
                  height={40}
                  // The uploaded mark is white — force it to black on the
                  // homepage's light background instead of shipping a second
                  // dark-colored asset just for this one inverted case.
                  className={`h-10 w-auto sm:h-12 ${invert ? "" : "brightness-0"}`}
                  placeholder={logo.lqip ? "blur" : "empty"}
                  blurDataURL={logo.lqip}
                />
              ) : (
                <span className="font-display font-black text-lg uppercase tracking-wide sm:text-xl">
                  {logoText ?? "insidePRO"}
                </span>
              )}
            </div>
          </RevealItem>
        </RevealStagger>

        <div
          className={`mt-16 pt-6 border-t ${borderClass} flex flex-col md:flex-row items-center justify-between gap-2 text-center md:text-left`}
        >
          {copyrightText && (
            <p className={`font-body text-xs ${labelClass}`}>
              © {new Date().getFullYear()} {copyrightText}
            </p>
          )}
          {legalText && (
            <p className={`font-body text-[11px] ${legalClass} max-w-xl`}>
              {legalText}
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
