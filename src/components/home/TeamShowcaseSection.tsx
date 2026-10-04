import Link from "next/link";
import { manrope } from "@/lib/fonts";
import { ArrowRightIcon } from "@/components/icons/ArrowRight";
import { Reveal, RevealItem, RevealStagger } from "@/components/motion/Reveal";
import {
  TeamMemberCard,
  type TeamMember,
} from "@/components/sections/TeamMemberCard";

type Props = {
  eyebrow?: string;
  heading?: string;
  teamMembers?: TeamMember[];
  /**
   * Flips the section onto a white (brand-light) background with all text
   * and label boxes inverted to black — used right after a ZoomTextTransition
   * that scrolls into white, so this section is the "new scene" the zoom
   * hands off to.
   */
  invert?: boolean;
  /** Optional closing copy + CTA, same fields the plain TeamSection renders. */
  outroText?: string;
  outroHighlight?: string;
  ctaLabel?: string;
  ctaLink?: string;
};

/**
 * Team grid of TeamMemberCards (photo with the name/role label notched into
 * its bottom-left corner; label below the photo on mobile).
 */
export function TeamShowcaseSection({
  eyebrow = "{ Meet Our Team }",
  heading = "PO CELOU DOBU SPOLUPRÁCE JSME TU S VÁMI",
  teamMembers = [],
  invert = false,
  outroText,
  outroHighlight,
  ctaLabel,
  ctaLink,
}: Props) {
  if (teamMembers.length === 0) return null;

  return (
    <section
      className={`pl-6 pr-6 py-24 sm:pl-24 md:pr-10 lg:pl-48 lg:pr-24 ${invert ? "bg-brand-light" : ""}`}
    >
      <div className="max-w-7xl mx-auto">
        <p
          className={`font-body text-sm tracking-widest uppercase mb-4 ${invert ? "text-brand-black/50" : "text-brand-gold"}`}
        >
          {eyebrow}
        </p>
        <h2
          className={`font-display font-black uppercase text-3xl sm:text-4xl leading-tight mb-16 ${invert ? "text-brand-black" : "text-brand-light"}`}
        >
          {heading}
        </h2>

        <RevealStagger className="grid grid-cols-2 xl:grid-cols-3 gap-x-4 sm:gap-x-10 xl:gap-x-14 gap-y-10 sm:gap-y-20">
          {teamMembers.map((member) => (
            <RevealItem key={member._id} className="group">
              <TeamMemberCard
                member={member}
                sizes="(min-width: 1280px) 390px, 50vw"
                invert={invert}
              />
            </RevealItem>
          ))}
        </RevealStagger>

        {(outroText || outroHighlight) && (
          <Reveal className="max-w-3xl mx-auto mt-20">
            <p
              className={`${manrope.className} font-normal text-lg leading-relaxed tracking-normal text-center ${invert ? "text-brand-black" : "text-brand-light"}`}
            >
              {outroText}
              {outroHighlight && (
                <>
                  {" "}
                  <span className={invert ? "text-brand-black/50" : "text-brand-gold"}>
                    {outroHighlight}
                  </span>
                </>
              )}
            </p>
          </Reveal>
        )}

        {ctaLabel && ctaLink && (
          <div className="flex justify-end mt-12">
            <Link
              href={ctaLink}
              className={`font-display font-medium text-lg leading-relaxed tracking-normal uppercase transition-colors flex items-center gap-2 ${
                invert
                  ? "text-brand-black hover:text-brand-black/50"
                  : "text-brand-gold hover:text-brand-light/50"
              }`}
            >
              {ctaLabel} <ArrowRightIcon />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
