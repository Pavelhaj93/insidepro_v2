import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/sanity/lib/image'

type Props = {
  headline: string
  backgroundImage?: { asset: { _ref: string } }
  buttonLabel?: string
  buttonLink?: string
}

export function CtaSection({ headline, backgroundImage, buttonLabel, buttonLink }: Props) {
  return (
    <section className="relative overflow-hidden py-32 md:py-48 px-8 md:px-12">
      {backgroundImage && (
        <>
          <Image
            src={urlFor(backgroundImage).width(1920).height(800).url()}
            alt=""
            fill
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-brand-black/60" />
        </>
      )}
      {!backgroundImage && <div className="absolute inset-0 bg-brand-dark" />}

      <div className="relative z-10 max-w-screen-xl mx-auto text-center">
        <h2 className="font-display font-bold text-5xl md:text-7xl lg:text-8xl uppercase leading-none text-brand-light mb-10">
          {headline}
        </h2>
        {buttonLabel && buttonLink && (
          <Link
            href={buttonLink}
            className="inline-block font-body text-sm tracking-widest uppercase px-8 py-4 border border-brand-light text-brand-light hover:bg-brand-light hover:text-brand-black transition-colors"
          >
            {buttonLabel}
          </Link>
        )}
      </div>
    </section>
  )
}
