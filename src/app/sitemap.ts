import type { MetadataRoute } from 'next'
import { client } from '@/sanity/lib/client'
import { pagesQuery } from '@/sanity/lib/queries'

const SITE_URL = 'https://www.insidepro.cz'

export const revalidate = 3600

// Only pages with isPublished == true (pagesQuery filters) — hidden pages
// must never be advertised to crawlers.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages: { slug: { current: string }; _updatedAt: string }[] = await client.fetch(pagesQuery)
  return [
    { url: SITE_URL, changeFrequency: 'weekly', priority: 1 },
    ...pages.map((p) => ({
      url: `${SITE_URL}/${p.slug.current}`,
      lastModified: p._updatedAt,
    })),
  ]
}
