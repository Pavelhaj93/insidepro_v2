import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/sanity/lib/image'

type Project = {
  _id: string
  title: string
  client?: string
  slug: { current: string }
  coverImage?: { asset: { _ref: string } }
  category?: string
  excerpt?: string
}

type Props = {
  heading?: string
  showViewAllLink?: boolean
  viewAllLabel?: string
  viewAllSlug?: string
  projects?: Project[]
}

export function FeaturedWorksSection({
  heading = 'VYBRANÉ PRÁCE',
  showViewAllLink = true,
  viewAllLabel = 'ZOBRAZIT VŠE',
  viewAllSlug = '/prace',
  projects = [],
}: Props) {
  return (
    <section className="px-8 md:px-12 py-24 max-w-screen-xl mx-auto">
      <div className="flex items-end justify-between mb-12">
        <h2 className="font-display font-bold text-4xl md:text-5xl uppercase text-brand-light">{heading}</h2>
        {showViewAllLink && (
          <Link href={viewAllSlug} className="font-body text-xs tracking-widest text-brand-light/50 hover:text-brand-gold transition-colors uppercase flex items-center gap-2">
            {viewAllLabel} <span>→</span>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map(project => (
          <Link key={project._id} href={`/prace/${project.slug.current}`} className="group block relative overflow-hidden aspect-[4/3] bg-brand-dark">
            {project.coverImage && (
              <Image
                src={urlFor(project.coverImage).width(800).height(600).url()}
                alt={project.title}
                fill
                className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
              {project.client && (
                <p className="font-body text-xs tracking-widest text-brand-gold uppercase mb-1">{project.client}</p>
              )}
              <h3 className="font-display font-bold text-lg uppercase text-brand-light">{project.title}</h3>
            </div>
          </Link>
        ))}
      </div>

      {projects.length === 0 && (
        <p className="font-body text-sm text-brand-light/30 text-center py-12">No projects added yet.</p>
      )}
    </section>
  )
}
