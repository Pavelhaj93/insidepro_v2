import Link from 'next/link'
import { client } from '@/sanity/lib/client'
import { homepageQuery } from '@/sanity/lib/queries'
import { SectionRenderer } from '@/components/SectionRenderer'

export const revalidate = 60

export default async function HomePage() {
  const page = await client.fetch(homepageQuery)

  if (!page) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center px-8">
          <h1 className="font-display font-bold text-4xl uppercase text-brand-light mb-4">insidePRO</h1>
          <p className="font-body text-sm text-brand-light/50 mb-8">
            Open the Studio and create a Page with <strong>Is Homepage</strong> enabled.
          </p>
          <Link href="/studio" className="font-body text-xs tracking-widest uppercase text-brand-gold border border-brand-gold px-6 py-3 hover:bg-brand-gold hover:text-brand-black transition-colors">
            Open Studio →
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main>
      <SectionRenderer blocks={page.blocks} />
    </main>
  )
}
