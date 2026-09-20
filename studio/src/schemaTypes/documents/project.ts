import { defineField, defineType } from 'sanity'

export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'client', title: 'Client Name', type: 'string' }),
    defineField({
      name: 'websiteUrl',
      title: 'Website URL',
      type: 'url',
      description: 'Company\'s website — shown as a "Visit website" link on the case-study hero',
    }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' }, validation: Rule => Rule.required() }),
    defineField({ name: 'coverImage', title: 'Cover Image', type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'cardImage',
      title: 'Card Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Single photo shown on this project\'s card in the homepage and /reference grids (falls back to Cover Image if empty)',
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      description: 'Extra images shown in the case-study page\'s gallery section',
    }),
    defineField({
      name: 'behindTheScenesGallery',
      title: 'Behind the Scenes Gallery',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      description: 'Behind-the-scenes production photos, shown as a scroll-driven filmstrip gallery on the case-study page.',
    }),
    defineField({
      name: 'hoverVideo',
      title: 'Hover Video (optional)',
      type: 'reference',
      to: [{ type: 'video' }],
      description: 'Plays on hover over this project\'s card in the homepage client showcase (falls back to Cover Image if empty)',
    }),
    defineField({
      name: 'projectVideo',
      title: 'Project Video (optional)',
      type: 'reference',
      to: [{ type: 'video' }],
      description: 'Shown as a video player on this project\'s case-study page',
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'category' }] }],
      description: 'Categories used for the filter tabs on the Reference page',
    }),
    defineField({ name: 'excerpt', title: 'Excerpt', type: 'text', rows: 3 }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [{ type: 'block' }, { type: 'image', options: { hotspot: true } }],
    }),
    defineField({ name: 'publishedAt', title: 'Published At', type: 'datetime' }),
  ],
  orderings: [{ title: 'Published, New', name: 'publishedAtDesc', by: [{ field: 'publishedAt', direction: 'desc' }] }],
  preview: {
    select: { title: 'title', subtitle: 'client', media: 'coverImage' },
  },
})
