import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'

type TeamMember = {
  _id: string
  name: string
  role?: string
  email?: string
  phone?: string
  photo?: { asset: { _ref: string } }
}

type Props = {
  heading?: string
  teamMembers?: TeamMember[]
}

export function TeamSection({ heading, teamMembers = [] }: Props) {
  return (
    <section className="px-8 md:px-12 py-24 max-w-screen-xl mx-auto">
      {heading && (
        <p className="font-body text-xs tracking-widest text-brand-light/40 uppercase mb-12">{heading}</p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
        {teamMembers.map(member => (
          <div key={member._id} className="group">
            <div className="relative aspect-[3/4] overflow-hidden bg-brand-dark mb-4 grayscale group-hover:grayscale-0 transition-all duration-500">
              {member.photo && (
                <Image
                  src={urlFor(member.photo).width(600).height(800).url()}
                  alt={member.name}
                  fill
                  className="object-cover object-center object-top"
                />
              )}
            </div>
            <h3 className="font-display font-bold text-base uppercase text-brand-light leading-tight">{member.name}</h3>
            {member.role && (
              <p className="font-body text-xs text-brand-light/50 mt-1 leading-snug">{member.role}</p>
            )}
            {member.email && (
              <a href={`mailto:${member.email}`} className="font-body text-xs text-brand-bronze hover:text-brand-gold transition-colors block mt-1">
                {member.email}
              </a>
            )}
            {member.phone && (
              <a href={`tel:${member.phone.replace(/\s/g, '')}`} className="font-body text-xs text-brand-light/40 block mt-0.5">
                {member.phone}
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
