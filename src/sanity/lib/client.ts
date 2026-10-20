import { createClient } from 'next-sanity'

// Enum/CSS values the code compares or feeds into styles. The default stega
// filter already skips `layout`, `slug`, `*Id`, URLs etc., but not these —
// encoded, `width === "half"` fails and `accentColor` becomes invalid CSS.
const STEGA_SKIP_FIELDS = new Set(['accentColor', 'width'])

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: process.env.NODE_ENV === 'production',
  // Stega (click-to-edit overlays in Presentation) is only turned on by
  // `defineLive` when `studioUrl` is set, and only in draft mode.
  stega: {
    studioUrl: process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || 'https://insidepro-v2.sanity.studio',
    filter: (props) => {
      const field = props.sourcePath.at(-1)
      if (typeof field === 'string' && STEGA_SKIP_FIELDS.has(field)) return false
      // Mux asset docs hold machine values (rendition names, playback data).
      if (props.sourceDocument?._type === 'mux.videoAsset') return false
      return props.filterDefault(props)
    },
  },
})
