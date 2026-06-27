import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/sanity/lib/image'

type Film = {
  _id: string
  title: string
  slug: { current: string }
  coverImage?: { asset: { _ref: string } }
  description?: string
  director?: string
  status?: string
}

const statusLabels: Record<string, string> = {
  'in-development': 'In Development',
  'in-production': 'In Production',
  'in-post-production': 'In Post-Production',
  'finishing': 'Finishing',
  'released': 'Released',
}

type Props = {
  label?: string
  heading?: string
  introText?: string
  films?: Film[]
}

export function FilmShowcaseSection({ label, heading, introText, films = [] }: Props) {
  return (
    <section className="px-8 md:px-12 py-24 max-w-screen-xl mx-auto">
      {label && (
        <p className="font-body text-xs tracking-widest text-brand-light/40 uppercase mb-4">{label}</p>
      )}
      {heading && (
        <h2 className="font-display font-bold text-4xl md:text-5xl uppercase text-brand-light mb-8">{heading}</h2>
      )}
      {introText && (
        <p className="font-body text-sm text-brand-light/60 leading-relaxed max-w-2xl mb-14">{introText}</p>
      )}

      <div className="flex flex-col gap-8">
        {films.map(film => (
          <Link key={film._id} href={`/filmy/${film.slug.current}`} className="group grid md:grid-cols-[280px_1fr] gap-6 items-start border-t border-brand-dark/60 pt-8">
            {film.coverImage && (
              <div className="relative aspect-video overflow-hidden bg-brand-dark">
                <Image
                  src={urlFor(film.coverImage).width(560).height(315).url()}
                  alt={film.title}
                  fill
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            )}
            <div className="flex flex-col gap-3">
              {film.status && (
                <span className="font-body text-xs tracking-widest text-brand-bronze uppercase">
                  {statusLabels[film.status] ?? film.status}
                </span>
              )}
              <h3 className="font-display font-bold text-2xl uppercase text-brand-light">{film.title}</h3>
              {film.director && (
                <p className="font-body text-xs text-brand-light/40">Režie: {film.director}</p>
              )}
              {film.description && (
                <p className="font-body text-sm text-brand-light/60 leading-relaxed">{film.description}</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
