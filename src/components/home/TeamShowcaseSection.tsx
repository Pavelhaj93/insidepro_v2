import { urlFor } from "@/sanity/lib/image";
import { SanityImage } from "@/components/ui/SanityImage";
import { RevealItem, RevealStagger } from "@/components/motion/Reveal";
import { InvertedCorner } from "@/components/icons/InvertedCorner";

type TeamMember = {
  _id: string;
  name: string;
  role?: string;
  photo?: { asset: { _ref: string } };
};

type Props = {
  eyebrow?: string;
  heading?: string;
  teamMembers?: TeamMember[];
};

/**
 * Each photo's bottom-left corner is covered by a solid black label box (name
 * + role) that reads as a notch cut into the card — a single concave fillet
 * (InvertedCorner) sits at the one inner corner where the label meets the
 * photo, so the cut reads as one smooth curve instead of a sharp right angle.
 */
export function TeamShowcaseSection({
  eyebrow = "{ Meet Our Team }",
  heading = "PO CELOU DOBU SPOLUPRÁCE JSME TU S VÁMI",
  teamMembers = [],
}: Props) {
  if (teamMembers.length === 0) return null;

  return (
    <section className="px-8 xl:px-0 py-24 max-w-6xl mx-auto">
      <p className="font-body text-sm tracking-widest uppercase text-brand-gold mb-4">
        {eyebrow}
      </p>
      <h2 className="font-display font-black uppercase text-3xl sm:text-4xl leading-tight text-brand-light mb-16">
        {heading}
      </h2>

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
                    className="object-cover object-center grayscale group-hover:grayscale-0 transition-all duration-500"
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
    </section>
  );
}
