import type { MetadataRoute } from 'next'

const SITE_URL = 'https://www.insidepro.cz'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/poc/', '/api/'] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
