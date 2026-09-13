import { defineField, defineType } from 'sanity'

export const category = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' }, validation: Rule => Rule.required() }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Tab order on the Reference page (lower = first)',
    }),
    defineField({
      name: 'video',
      title: 'Video',
      type: 'file',
      options: { accept: 'video/*' },
      description:
        'For categories with no projects of their own (e.g. Showreel) — when set, selecting this category on the Reference page shows this video full-width instead of the project grid.',
    }),
  ],
  orderings: [{ title: 'Tab order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: {
    select: { title: 'title', subtitle: 'slug.current' },
  },
})
