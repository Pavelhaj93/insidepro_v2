import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { ComponentProps } from 'react'
import { fetchSanity } from '@/sanity/lib/live'
import { pageBySlugQuery, pagesQuery } from '@/sanity/lib/queries'
import { SectionRenderer } from '@/components/SectionRenderer'

type Props = {
  params: Promise<{ slug: string }>
}

type PageData = {
  title?: string
  seoTitle?: string
  seoDescription?: string
  blocks: ComponentProps<typeof SectionRenderer>['blocks']
} | null

export async function generateStaticParams() {
  // No request scope here (build time) — perspective/stega must be explicit so
  // sanityFetch doesn't try to read draftMode().
  const pages = await fetchSanity<{ slug: { current: string } }[]>({
    query: pagesQuery,
    perspective: 'published',
    stega: false,
  })
  return pages.map((p) => ({ slug: p.slug.current }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const page = await fetchSanity<PageData>({ query: pageBySlugQuery, params: { slug }, stega: false })
  if (!page) return { robots: { index: false, follow: false } }
  return {
    title: page.seoTitle ?? page.title,
    description: page.seoDescription,
  }
}

export default async function DynamicPage({ params }: Props) {
  const { slug } = await params
  // pageBySlugQuery only matches pages with isPublished == true, so an
  // unpublished page resolves to null here. Next still renders unknown [slug]
  // params on demand (dynamicParams defaults to true), which makes this guard
  // what actually 404s a direct visit to a hidden page's URL.
  const page = await fetchSanity<PageData>({ query: pageBySlugQuery, params: { slug } })
  if (!page) notFound()

  return (
    <main>
      <SectionRenderer blocks={page.blocks} />
    </main>
  )
}
