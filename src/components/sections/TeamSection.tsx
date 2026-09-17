import Link from "next/link";
import { manrope } from "@/lib/fonts";
import { ArrowRightIcon } from "@/components/icons/ArrowRight";
import { InvertedCorner } from "@/components/icons/InvertedCorner";
import { urlFor } from "@/sanity/lib/image";
import { Reveal, RevealItem, RevealStagger } from "@/components/motion/Reveal";
import { SanityImage } from "@/components/ui/SanityImage";

type TeamMember = {
  _id: string;
  name: string;
  role?: string;
  email?: string;
  phone?: string;
  photo?: { asset: { _ref: string }; lqip?: string };
};

type Props = {
  eyebrow?: string;
  heading?: string;
  teamMembers?: TeamMember[];
  outroText?: string;
  outroHighlight?: string;
  ctaLabel?: string;
  ctaLink?: string;
};

// Same card treatment as the homepage's TeamShowcaseSection — the bottom-left
// corner reads as a notch cut into the photo via one InvertedCorner fillet at
// the inner corner where the label meets the image.
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

      <RevealStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20">
        {teamMembers.map((member) => (
          <RevealItem key={member._id} className="group">
            <div className="relative aspect-3/4">
              <div className="absolute inset-0 rounded-4xl overflow-hidden bg-brand-dark">
                {member.photo && (
                  <SanityImage
                    src={urlFor(member.photo).url()}
                    alt={member.name}
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    quality={85}
                    className="object-cover object-center grayscale scale-100 rotate-0 transition-all duration-500 ease-out group-hover:grayscale-0 group-hover:scale-110 group-hover:rotate-2"
                    blurDataURL={member.photo.lqip}
                  />
                )}
              </div>

              <InvertedCorner className="absolute rotate-90 left-[68%] bottom-0 w-8 h-8 text-brand-black" />
              <InvertedCorner className="absolute rotate-90 left-0 bottom-[20%] w-8 h-8 text-brand-black" />

              <div className="absolute bottom-0 left-0 w-[68%] h-[20%] bg-brand-black py-1 flex flex-col justify-center rounded-tr-4xl">
                <h3 className="font-display font-black uppercase text-lg leading-tight text-brand-light">
                  {member.name}
                </h3>
                {member.role && (
                  <p className="font-body text-xs uppercase tracking-wide text-brand-gold mt-1.5">
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
