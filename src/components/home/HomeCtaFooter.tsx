import Link from "next/link";
import { Reveal, RevealItem, RevealStagger } from "@/components/motion/Reveal";
import { SocialLinks } from "@/components/layout/SocialLinks";

type SocialLinksValue = {
  instagram?: string | null;
  linkedin?: string | null;
  facebook?: string | null;
  vimeo?: string | null;
};

type NavLink = { label: string; href: string };

type Props = {
  headingLine1?: string | null;
  headingLine2?: string | null;
  email?: string | null;
  phone?: string | null;
  socialLinks?: SocialLinksValue | null;
  navLinks?: NavLink[];
  copyrightText?: string | null;
  legalText?: string | null;
};

const DEFAULT_NAV_LINKS: NavLink[] = [
  { label: "Úvod", href: "/" },
  { label: "Reference", href: "/reference" },
  { label: "Filmy", href: "/filmy" },
  { label: "Kariéra", href: "/kariera" },
  { label: "Kontakt", href: "/kontakt" },
];

/**
 * Design POC: folds the homepage's CTA into the footer itself instead of a
 * separate CtaSection-with-background-photo — white/black instead of the
 * site's usual dark palette, so landing here after the (also inverted) team
 * section reads as one deliberate "we've arrived" closing beat. Hardcoded
 * layout, but reuses real footer/settings content already fetched on the
 * homepage rather than fake placeholders.
 */
export function HomeCtaFooter({
  headingLine1 = "Máte projekt?",
  headingLine2 = "Pojďme na to",
  email,
  phone,
  socialLinks,
  navLinks = DEFAULT_NAV_LINKS,
  copyrightText,
  legalText,
}: Props) {
  return (
    <section className="bg-brand-light text-brand-black pl-6 pr-6 py-16 sm:pl-24 sm:py-20 md:pr-10 md:py-28 lg:pl-48 lg:pr-24">
      <div className="max-w-7xl mx-auto">
        <Reveal>
          <h2 className="font-display font-black uppercase text-3xl leading-[0.95] tracking-normal sm:text-4xl md:text-6xl lg:text-7xl">
            {headingLine1}
            <br />
            {headingLine2}
          </h2>
        </Reveal>

        <RevealStagger className="grid grid-cols-1 gap-10 mt-16 pt-10 border-t border-brand-black/15 sm:mt-20 sm:grid-cols-2 lg:grid-cols-3">
          <RevealItem>
            <p className="font-body text-xs tracking-widest uppercase text-brand-black/50 mb-4">
              Stránky
            </p>
            <ul className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-display font-bold text-lg uppercase hover:text-brand-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </RevealItem>

          <RevealItem>
            <p className="font-body text-xs tracking-widest uppercase text-brand-black/50 mb-4">
              Kontakt
            </p>
            <div className="flex flex-col gap-2">
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="font-display font-bold text-lg uppercase hover:text-brand-gold transition-colors break-all"
                >
                  {email}
                </a>
              )}
              {phone && (
                <a
                  href={`tel:${phone.replace(/\s+/g, "")}`}
                  className="font-display font-bold text-lg uppercase hover:text-brand-gold transition-colors"
                >
                  {phone}
                </a>
              )}
            </div>
          </RevealItem>

          <RevealItem>
            <p className="font-body text-xs tracking-widest uppercase text-brand-black/50 mb-4">
              Sledujte nás
            </p>
            {socialLinks && (
              <SocialLinks
                links={socialLinks}
                iconSize={22}
                linkClassName="text-brand-black hover:text-brand-gold"
              />
            )}
          </RevealItem>
        </RevealStagger>

        <div className="mt-16 pt-6 border-t border-brand-black/15 flex flex-col md:flex-row items-center justify-between gap-2 text-center md:text-left">
          {copyrightText && (
            <p className="font-body text-xs text-brand-black/50">
              © {new Date().getFullYear()} {copyrightText}
            </p>
          )}
          {legalText && (
            <p className="font-body text-[11px] text-brand-black/40 max-w-xl">
              {legalText}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
