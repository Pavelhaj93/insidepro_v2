import { defineField, defineType } from 'sanity'

export const film = defineType({
  name: 'film',
  title: 'Film',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' }, validation: Rule => Rule.required() }),
    defineField({ name: 'coverImage', title: 'Cover Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 4 }),
    defineField({ name: 'director', title: 'Director', type: 'string' }),
    defineField({ name: 'production', title: 'Production', type: 'string' }),
    defineField({ name: 'coproducer', title: 'Co-producer', type: 'string' }),
    defineField({ name: 'partners', title: 'Partners', type: 'string' }),
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
    defineField({ name: 'publishedAt', title: 'Published At', type: 'datetime' }),
  ],
  orderings: [{ title: 'Published, New', name: 'publishedAtDesc', by: [{ field: 'publishedAt', direction: 'desc' }] }],
  preview: {
    select: { title: 'title', subtitle: 'status', media: 'coverImage' },
  },
})
