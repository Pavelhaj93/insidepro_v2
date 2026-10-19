import { defineField, defineType } from 'sanity'

// Sub-pages of nonshoots.com (e.g. /video, /foto), rendered by the separate nonshoots Next app.
export const nsPage = defineType({
  name: 'nsPage',
  title: 'Non Shoots – stránka',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Název', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({
      name: 'slug',
      title: 'Adresa (URL)',
      type: 'slug',
      options: { source: 'title' },
      description: 'Např. „video“ → nonshoots.com/video',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'intro',
      title: 'Úvodní text',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'sections',
      title: 'Obsah stránky',
      type: 'array',
      of: [{ type: 'nsVideoGrid' }, { type: 'nsPhotoGallery' }],
    }),
    defineField({ name: 'metaDescription', title: 'Popis pro vyhledávače', type: 'text', rows: 3 }),
  ],
  preview: {
    select: { title: 'title', slug: 'slug.current' },
    prepare: ({ title, slug }) => ({ title, subtitle: slug ? `/${slug}` : undefined }),
  },
})
