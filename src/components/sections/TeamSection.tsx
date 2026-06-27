import Image from "next/image";
import { manrope } from "@/lib/fonts";
import { urlFor } from "@/sanity/lib/image";

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
};

export function TeamSection({ heading, teamMembers = [] }: Props) {
  return (
    <section className="px-8 md:px-12 py-24 max-w-screen-xl mx-auto">
      {heading && (
        <p className="font-body text-xs tracking-widest text-brand-light/40 uppercase mb-12">
          {heading}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {teamMembers.map((member) => (
          <div key={member._id} className="group h-full flex flex-col">
            <div className="relative aspect-3/4 overflow-hidden bg-brand-dark mb-0 grayscale group-hover:grayscale-0 transition-all duration-500">
              {member.photo && (
                <Image
                  src={urlFor(member.photo).width(600).height(800).url()}
                  alt={member.name}
                  fill
                  className="object-cover object-center"
                />
              )}
            </div>
            <div className="bg-brand-grey px-6 py-5 flex flex-col flex-1">
              <h3 className="font-display font-black text-[31.28px] leading-[30.64px] tracking-normal uppercase text-brand-light">
                {member.name}
              </h3>
              <div className="h-px bg-brand-gold my-4" />
              {member.role && (
                <p
                  className={`${manrope.className} font-normal text-[18px] leading-[30.3px] tracking-normal text-brand-gold`}
                >
                  {member.role}
                </p>
              )}
              <div className="mt-auto pt-4">
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className={`${manrope.className} font-normal text-[18px] leading-[30.3px] tracking-normal text-brand-light hover:text-brand-gold transition-colors block`}
                  >
                    {member.email}
                  </a>
                )}
                {member.phone && (
                  <a
                    href={`tel:${member.phone.replace(/\s/g, "")}`}
                    className={`${manrope.className} font-extrabold text-[18px] leading-[30.3px] tracking-normal text-brand-light block mt-0.5`}
                  >
                    {member.phone}
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
