import Link from "next/link";
import { manrope } from "@/lib/fonts";
import { ArrowRightIcon } from "@/components/icons/ArrowRight";
import { Reveal, RevealItem, RevealStagger } from "@/components/motion/Reveal";
import { TeamMemberCard, type TeamMember } from "./TeamMemberCard";

type Props = {
  eyebrow?: string;
  heading?: string;
  teamMembers?: TeamMember[];
  outroText?: string;
  outroHighlight?: string;
  ctaLabel?: string;
  ctaLink?: string;
};

// Same card as the homepage's TeamShowcaseSection (see TeamMemberCard).
export function TeamSection({
  eyebrow,
  heading,
  teamMembers = [],
  outroText,
  outroHighlight,
  ctaLabel,
  ctaLink,
}: Props) {
  return (
    <section className="px-8 xl:px-0 py-24 max-w-6xl mx-auto">
      {eyebrow && (
        <p className="font-body text-sm tracking-widest uppercase mb-4 text-brand-gold">
          {eyebrow}
        </p>
      )}
      {heading && (
        <h2 className="font-display font-black uppercase text-3xl sm:text-4xl leading-tight text-brand-light mb-16">
          {heading}
        </h2>
      )}

      <RevealStagger className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 sm:gap-x-10 gap-y-10 sm:gap-y-20">
        {teamMembers.map((member) => (
          <RevealItem key={member._id} className="group">
            <TeamMemberCard
              member={member}
              sizes="(min-width: 1024px) 33vw, 50vw"
            />
          </RevealItem>
        ))}
      </RevealStagger>

      {(outroText || outroHighlight) && (
        <Reveal className="max-w-3xl mx-auto mt-20">
          <p
            className={`${manrope.className} font-normal text-lg leading-relaxed tracking-normal text-brand-light text-center`}
          >
            {outroText}
            {outroHighlight && (
              <>
                {" "}
                <span className="text-brand-gold">{outroHighlight}</span>
              </>
            )}
          </p>
        </Reveal>
      )}

      {ctaLabel && ctaLink && (
        <div className="flex justify-end mt-12">
          <Link
            href={ctaLink}
            className="font-display font-medium text-lg text-brand-gold leading-relaxed tracking-normal uppercase hover:text-brand-light/50 transition-colors flex items-center gap-2"
          >
            {ctaLabel} <ArrowRightIcon />
          </Link>
        </div>
      )}
    </section>
  );
}
