import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { SocialLinks } from "./SocialLinks";
import { Reveal } from "@/components/motion/Reveal";

type FooterContent = {
  headingLine1?: string | null;
  headingLine2?: string | null;
  headingHighlight?: string | null;
  backgroundImage?: { asset: { _ref: string } } | null;
  email?: string | null;
  phone?: string | null;
  copyrightText?: string | null;
  legalText?: string | null;
};

type SocialLinksValue = {
  instagram?: string | null;
  linkedin?: string | null;
  facebook?: string | null;
  vimeo?: string | null;
};

type Props = {
  content: FooterContent | null;
  socialLinks: SocialLinksValue | null;
};

export function Footer({ content, socialLinks }: Props) {
  const headingLine1 = content?.headingLine1 ?? "Máte projekt?";
  const headingLine2 = content?.headingLine2 ?? "Pojďme na to";
  const headingHighlight = content?.headingHighlight ?? "Pojďme";
  const backgroundImage = content?.backgroundImage ?? null;
  const email = content?.email;
  const phone = content?.phone;
  const copyrightText =
    content?.copyrightText ?? "R&T Production s.r.o. - All rights reserved.";
  const legalText = content?.legalText;

  const line2Parts = headingLine2.split(headingHighlight);

  return (
    <footer className="relative overflow-hidden">
      {/* Background image */}
      {/* {backgroundImage ? (
        <>
          <Image
            src={urlFor(backgroundImage).width(1920).height(1080).url()}
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-linear-to-r from-brand-black/80 via-brand-black/60 to-brand-black/90" />
          <div className="absolute inset-0 bg-linear-to-t from-brand-black via-brand-black/20 to-transparent" />
        </>
      ) : (
        <div className="absolute inset-0 bg-brand-black" />
      )} */}

      <div className="relative z-10 px-8 py-16 md:px-12 md:py-24">
        <div className="max-w-7xl mx-auto">
          {/* CTA heading */}
          {/* <h2 className="text-center font-display font-black text-4xl md:text-6xl lg:text-7xl leading-tight tracking-normal uppercase text-brand-light">
            {headingLine1}
            <br />
            {line2Parts[0]}
            <em className="italic text-brand-gold">{headingHighlight}</em>
            {line2Parts[1]}
          </h2> */}

          <Reveal className="border-t border-brand-bronze/30 mt-10 pt-6 px-10 flex flex-col md:flex-row items-center justify-between gap-4">
            {email ? (
              <a
                href={`mailto:${email}`}
                className="font-display font-bold text-sm md:text-base uppercase tracking-wide text-brand-light hover:text-brand-gold transition-colors"
              >
                {email}
              </a>
            ) : (
              <span />
            )}

            {socialLinks && <SocialLinks links={socialLinks} iconSize={18} />}

            {phone ? (
              <a
                href={`tel:${phone.replace(/\s+/g, "")}`}
                className="font-display font-bold text-sm md:text-base uppercase tracking-wide text-brand-light hover:text-brand-gold transition-colors"
              >
                {phone}
              </a>
            ) : (
              <span />
            )}
          </Reveal>

          <div className="border-t border-brand-bronze/30 mt-6 pt-6 text-center">
            <p className="font-display font-bold text-sm text-brand-light">
              © {new Date().getFullYear()} {copyrightText}
            </p>
            {legalText && (
              <p className="text-xs text-brand-light/40 leading-relaxed mt-2 mx-auto">
                {legalText}
              </p>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
