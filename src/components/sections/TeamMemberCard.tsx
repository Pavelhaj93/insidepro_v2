import { InvertedCorner } from "@/components/icons/InvertedCorner";
import { urlFor } from "@/sanity/lib/image";
import { SanityImage } from "@/components/ui/SanityImage";

export type TeamMember = {
  _id: string;
  name: string;
  role?: string;
  photo?: { asset: { _ref: string }; lqip?: string };
};

type Props = {
  member: TeamMember;
  sizes: string;
  /** Light (brand-light) label/notch for sections on a white background. */
  invert?: boolean;
};

/**
 * From `sm` up, the photo's bottom-left corner is covered by a solid label box
 * (name + role) that reads as a notch cut into the card — a single concave
 * fillet (InvertedCorner) sits at each inner corner where the label meets the
 * photo. The label and fillets overlap each other and the card edge by 1px:
 * their edges land on fractional pixels, and without the overlap the photo
 * bleeds through the antialiased seams as a hairline (most visible on hover,
 * once the photo is colored and rotated).
 *
 * Below `sm` the grid is two columns, the notch would be too narrow for the
 * name, so the label drops below the photo instead.
 */
export function TeamMemberCard({ member, sizes, invert = false }: Props) {
  const fill = invert ? "text-brand-light" : "text-brand-black";

  return (
    <>
      <div className="relative aspect-3/4">
        <div className="absolute inset-0 isolate rounded-2xl sm:rounded-4xl overflow-hidden bg-brand-dark">
          {member.photo && (
            <SanityImage
              src={urlFor(member.photo).url()}
              alt={member.name}
              sizes={sizes}
              quality={85}
              className="object-cover object-center grayscale scale-100 rotate-0 transition-all duration-500 ease-out group-hover:grayscale-0 group-hover:scale-110 group-hover:rotate-2"
              blurDataURL={member.photo.lqip}
            />
          )}
        </div>

        <InvertedCorner
          className={`hidden sm:block absolute rotate-90 left-[calc(68%-1px)] -bottom-px w-8 h-8 ${fill}`}
        />
        <InvertedCorner
          className={`hidden sm:block absolute rotate-90 -left-px bottom-[calc(20%-1px)] w-8 h-8 ${fill}`}
        />

        <div
          className={`hidden sm:flex absolute -bottom-px -left-px w-[calc(68%+1px)] h-[calc(20%+1px)] py-1 flex-col justify-center rounded-tr-4xl ${invert ? "bg-brand-light" : "bg-brand-black"}`}
        >
          <MemberLabel member={member} invert={invert} />
        </div>
      </div>

      <div className="sm:hidden mt-3">
        <MemberLabel member={member} invert={invert} />
      </div>
    </>
  );
}

function MemberLabel({ member, invert }: { member: TeamMember; invert: boolean }) {
  return (
    <>
      <h3
        className={`font-display font-black uppercase text-sm sm:text-lg leading-tight ${invert ? "text-brand-black" : "text-brand-light"}`}
      >
        {member.name}
      </h3>
      {member.role && (
        <p
          className={`font-body text-[0.625rem] sm:text-xs uppercase tracking-wide mt-1 sm:mt-1.5 ${invert ? "text-brand-black/50" : "text-brand-gold"}`}
        >
          {member.role}
        </p>
      )}
    </>
  );
}
