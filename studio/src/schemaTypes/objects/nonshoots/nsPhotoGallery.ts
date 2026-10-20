import { defineArrayMember, defineField, defineType } from 'sanity'

export const nsPhotoGallery = defineType({
  name: 'nsPhotoGallery',
  title: 'Galerie fotek',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Nadpis', type: 'string' }),
    defineField({
      name: 'images',
      title: 'Fotky',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [defineField({ name: 'alt', title: 'Popis fotky (pro nevidomé a vyhledávače)', type: 'string' })],
        }),
      ],
      options: { layout: 'grid' },
    }),
  ],
  preview: {
    select: { title: 'heading', images: 'images', media: 'images.0' },
    prepare: ({ title, images, media }) => ({
      title: title || 'Galerie fotek',
      subtitle: `Fotek: ${images?.length ?? 0}`,
      media,
    }),
  },
})
