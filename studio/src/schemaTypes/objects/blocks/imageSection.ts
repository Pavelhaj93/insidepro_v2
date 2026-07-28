import { defineField, defineType } from 'sanity'

export const imageSection = defineType({
  name: 'imageSection',
  title: 'Image Section',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      validation: Rule => Rule.required(),
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative Text',
          type: 'string',
          validation: Rule => Rule.required().warning('Alt text is important for SEO and accessibility'),
        }),
      ],
    }),
  ],
  preview: {
    select: { media: 'image', title: 'image.alt' },
    prepare({ media, title }) {
      return { title: title ? `Image: ${title}` : 'Image Section', media }
    },
  },
})
