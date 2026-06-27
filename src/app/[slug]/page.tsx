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
  const pages = await client.fetch(pagesQuery)
  return pages
    .filter((p: { isHomepage?: boolean; slug?: { current: string } }) => !p.isHomepage && p.slug?.current)
    .map((p: { slug: { current: string } }) => ({ slug: p.slug.current }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const page = await client.fetch(pageBySlugQuery, { slug })
  if (!page) return {}
  return {
    title: page.seoTitle ?? page.title,
    description: page.seoDescription,
  }
}

export default async function DynamicPage({ params }: Props) {
  const { slug } = await params
  const page = await client.fetch(pageBySlugQuery, { slug })

  if (!page) notFound()

  return (
    <main>
      <SectionRenderer blocks={page.blocks} />
    </main>
  )
}
