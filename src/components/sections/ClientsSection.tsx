import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'

type ClientItem = {
  name: string
  logo?: { asset: { _ref: string } }
  url?: string
}

type Props = {
  label?: string
  supportLabel?: string
  clients?: ClientItem[]
}

export function ClientsSection({ label, supportLabel, clients = [] }: Props) {
  return (
    <section className="px-8 md:px-12 py-24 border-t border-brand-dark/60 max-w-screen-xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
        {label && (
          <p className="font-body text-xs tracking-widest text-brand-light/40 uppercase">{label}</p>
        )}
        {supportLabel && (
          <p className="font-body text-xs tracking-widest text-brand-light/40 uppercase">{supportLabel}</p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-8 md:gap-12">
        {clients.map((client, i) => (
          <div key={i} className="opacity-50 hover:opacity-100 transition-opacity">
            {client.logo ? (
              <div className="relative h-8 w-24">
                <Image
                  src={urlFor(client.logo).height(64).url()}
                  alt={client.name}
                  fill
                  className="object-contain object-left filter invert"
                />
              </div>
            ) : (
              <span className="font-display font-bold text-sm uppercase text-brand-light tracking-widest">{client.name}</span>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
