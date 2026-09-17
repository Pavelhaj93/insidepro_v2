import Link from "next/link";
import { manrope } from "@/lib/fonts";
import { ArrowRightIcon } from "@/components/icons/ArrowRight";
import { urlFor } from "@/sanity/lib/image";
import { SanityImage } from "@/components/ui/SanityImage";
import { Reveal, RevealItem, RevealStagger } from "@/components/motion/Reveal";
import { InvertedCorner } from "@/components/icons/InvertedCorner";

type TeamMember = {
  _id: string;
  name: string;
  role?: string;
  photo?: { asset: { _ref: string }; lqip?: string };
};

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
 * Each photo's bottom-left corner is covered by a solid label box (name +
 * role) that reads as a notch cut into the card — a single concave fillet
 * (InvertedCorner) sits at the one inner corner where the label meets the
 * photo, so the cut reads as one smooth curve instead of a sharp right angle.
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
      <div className="max-w-6xl mx-auto">
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

        <RevealStagger className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-20">
          {teamMembers.map((member) => (
            <RevealItem key={member._id} className="group">
              <div className="relative aspect-3/4">
                <div className="absolute inset-0 rounded-4xl overflow-hidden bg-brand-dark">
                  {member.photo && (
                    <SanityImage
                      src={urlFor(member.photo).url()}
                      alt={member.name}
                      sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
                      quality={85}
                      className="object-cover object-center grayscale scale-100 rotate-0 transition-all duration-500 ease-out group-hover:grayscale-0 group-hover:scale-110 group-hover:rotate-2"
                      blurDataURL={member.photo.lqip}
                    />
                  )}
                </div>

                <InvertedCorner
                  className={`absolute rotate-90 left-[68%] bottom-0 w-8 h-8 ${invert ? "text-brand-light" : "text-brand-black"}`}
                />
                <InvertedCorner
                  className={`absolute rotate-90 left-0 bottom-[20%] w-8 h-8 ${invert ? "text-brand-light" : "text-brand-black"}`}
                />

                <div
                  className={`absolute bottom-0 left-0 w-[68%] h-[20%] py-1 flex flex-col justify-center rounded-tr-4xl ${invert ? "bg-brand-light" : "bg-brand-black"}`}
                >
                  <h3
                    className={`font-display font-black uppercase text-lg leading-tight ${invert ? "text-brand-black" : "text-brand-light"}`}
                  >
                    {member.name}
                  </h3>
                  {member.role && (
                    <p
                      className={`font-body text-xs uppercase tracking-wide mt-1.5 ${invert ? "text-brand-black/50" : "text-brand-gold"}`}
                    >
                      {member.role}
                    </p>
                  )}
                </div>
              </div>
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
