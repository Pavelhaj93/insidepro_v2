import { defineField, defineType } from 'sanity'

export const film = defineType({
  name: 'film',
  title: 'Film',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: Rule => Rule.required() }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        isUnique: async (slug, context) => {
          const { document, getClient } = context
          const client = getClient({ apiVersion: '2024-01-01' })
          const id = document?._id.replace(/^drafts\./, '')
          const query = `!defined(*[(_type == "project" || _type == "film") && !(_id in [$draft, $published]) && slug.current == $slug][0]._id)`
          return client.fetch(query, { draft: `drafts.${id}`, published: id, slug })
        },
      },
      validation: Rule => Rule.required(),
    }),
    defineField({ name: 'coverImage', title: 'Cover Image', type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'cardImage',
      title: 'Card Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Single photo shown on this film\'s card in the Film Showcase block and the /reference grid (falls back to Cover Image if empty)',
    }),
    defineField({
      name: 'description',
      title: 'Card Excerpt',
      type: 'text',
      rows: 4,
      description: 'Short teaser shown on this film\'s card in the /reference grid hover state and on the Film Showcase block.',
    }),
    defineField({ name: 'genre', title: 'Žánr', type: 'string' }),
    defineField({ name: 'country', title: 'Země', type: 'string' }),
    defineField({ name: 'director', title: 'Director', type: 'string' }),
    defineField({ name: 'production', title: 'Production', type: 'string' }),
    defineField({ name: 'coproducer', title: 'Co-producer', type: 'string' }),
    defineField({
      name: 'partners',
      title: 'Partners',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
      description: 'Type a partner name and press Enter/Tab to add it as a tag. Shown as individual badges on the case-study page.',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'In Development', value: 'in-development' },
          { title: 'In Production', value: 'in-production' },
          { title: 'In Post-Production', value: 'in-post-production' },
          { title: 'Finishing', value: 'finishing' },
          { title: 'Released', value: 'released' },
        ],
      },
    }),
    defineField({
      name: 'yearOfProduction',
      title: 'Rok výroby',
      type: 'string',
      description: 'Free text, e.g. "2027" or a range like "2025 / 2026".',
    }),
    defineField({
      name: 'synopsis',
      title: 'O filmu',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [{ title: 'Normal', value: 'normal' }],
          lists: [],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
              { title: 'Gold', value: 'gold' },
            ],
            annotations: [],
          },
        },
      ],
      description: 'The flowing "O filmu" narrative text — one block per paragraph, shown on the case-study page.',
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      description: 'Photos shown in the case-study page\'s gallery section.',
    }),
    defineField({
      name: 'trailerVideo',
      title: 'Trailer Video (optional)',
      type: 'reference',
      to: [{ type: 'video' }],
      description: 'Shown as a video player on this film\'s case-study page.',
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'category' }] }],
      description: 'Categories used for the filter tabs on the Reference page.',
    }),
    defineField({ name: 'publishedAt', title: 'Published At', type: 'datetime' }),
    defineField({
      name: 'relatedProject',
      title: 'Related Project (Legacy — superseded by this film\'s own case-study fields)',
      type: 'reference',
      to: [{ type: 'project' }],
      description: 'Deprecated. Films are now their own case-study pages (see O filmu / Gallery / Trailer above). Keep only until an existing migration is verified, then clear this field.',
      hidden: ({ document }) => !document?.relatedProject,
    }),
  ],
  orderings: [{ title: 'Published, New', name: 'publishedAtDesc', by: [{ field: 'publishedAt', direction: 'desc' }] }],
  preview: {
    select: { title: 'title', subtitle: 'status', media: 'coverImage' },
  },
})
