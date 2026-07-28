import Image from "next/image";
import Link from "next/link";
import { manrope } from "@/lib/fonts";
import { ArrowRightIcon } from "@/components/icons/ArrowRight";
import { urlFor } from "@/sanity/lib/image";
import { Reveal, RevealItem, RevealStagger } from "@/components/motion/Reveal";

type TeamMember = {
  _id: string;
  name: string;
  role?: string;
  email?: string;
  phone?: string;
  photo?: { asset: { _ref: string } };
};

type Props = {
  heading?: string;
  teamMembers?: TeamMember[];
  outroText?: string;
  outroHighlight?: string;
  ctaLabel?: string;
  ctaLink?: string;
};

export function TeamSection({
  heading,
  teamMembers = [],
  outroText,
  outroHighlight,
  ctaLabel,
  ctaLink,
}: Props) {
  return (
    <section className="px-8 xl:px-0 py-24 max-w-7xl mx-auto">
      {/* {heading && (
        <p className="font-body text-xs tracking-widest text-brand-light/40 uppercase mb-12">
          {heading}
        </p>
      )} */}

      <RevealStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {teamMembers.map((member) => (
          <RevealItem key={member._id} className="group h-full flex flex-col">
            <div className="relative aspect-3/4 rounded-t-md overflow-hidden bg-brand-dark mb-0 grayscale group-hover:grayscale-0 transition-all duration-500">
              {member.photo && (
                <Image
                  src={urlFor(member.photo).width(600).height(800).url()}
                  alt={member.name}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover object-center"
                />
              )}
            </div>
            <div className="bg-brand-grey px-6 py-5 flex flex-col flex-1 rounded-b-md">
              <h3 className="font-display font-black text-2xl leading-none md:text-3xl tracking-normal uppercase text-brand-light">
                {member.name}
              </h3>
              <div className="h-px bg-brand-gold my-4" />
              {member.role && (
                <p
                  className={`${manrope.className} font-normal text-lg leading-relaxed tracking-normal text-brand-gold`}
                >
                  {member.role}
                </p>
              )}
              <div className="mt-auto pt-4">
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className={`${manrope.className} font-normal text-lg leading-relaxed tracking-normal text-brand-light hover:text-brand-gold transition-colors block`}
                  >
                    {member.email}
                  </a>
                )}
                {member.phone && (
                  <a
                    href={`tel:${member.phone.replace(/\s/g, "")}`}
                    className={`${manrope.className} font-extrabold text-lg leading-relaxed tracking-normal text-brand-light block mt-0.5`}
                  >
                    {member.phone}
                  </a>
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
