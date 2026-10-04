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
      name: 'featuredVideo',
      title: 'Video',
      type: 'reference',
      to: [{ type: 'video' }],
      description:
        'For categories with no projects of their own (e.g. Showreel) — pick a video from the Video library; selecting this category on the Reference page then shows it full-width (with its poster) instead of the project grid.',
    }),
    defineField({
      name: 'video',
      title: 'Video file (legacy)',
      type: 'file',
      options: { accept: 'video/*' },
      description:
        'Deprecated — superseded by "Video" above, which picks from the Video library instead of a one-off upload. Still used as a fallback while "Video" is empty; clear it once "Video" is set.',
      hidden: ({ document }) => !document?.video,
    }),
  ],
  orderings: [{ title: 'Tab order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: {
    select: { title: 'title', subtitle: 'slug.current' },
  },
})
