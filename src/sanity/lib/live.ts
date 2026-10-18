import { defineLive } from 'next-sanity/live'
import { client } from './client'

export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: process.env.SANITY_API_READ_TOKEN,
  browserToken: process.env.SANITY_API_READ_TOKEN,
})

/**
 * `sanityFetch` with the result shape stated by the caller. The queries are
 * plain `groq` strings (no query TypeGen yet), so `sanityFetch` alone types
 * `data` as `unknown` — callers derive `T` from the props the data feeds.
 */
export async function fetchSanity<T>(options: Parameters<typeof sanityFetch>[0]): Promise<T> {
  const { data } = await sanityFetch(options)
  return data as T
}
