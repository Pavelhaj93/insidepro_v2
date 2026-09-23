import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import { pageBySlugQuery, pagesQuery } from '@/sanity/lib/queries'
import { SectionRenderer } from '@/components/SectionRenderer'

export const revalidate = 60

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const pages: { slug: { current: string } }[] = await client.fetch(pagesQuery)
  return pages.map((p) => ({ slug: p.slug.current }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const page = await client.fetch(pageBySlugQuery, { slug })
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
  const page = await client.fetch(pageBySlugQuery, { slug })
  if (!page) notFound()

  return (
    <main>
      <SectionRenderer blocks={page.blocks} />
    </main>
  )
}
