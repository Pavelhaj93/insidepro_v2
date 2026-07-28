import { defineField, defineType } from 'sanity'

export const brandLogo = defineType({
  name: 'brandLogo',
  title: 'Logo',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: Rule => Rule.required() }),
    defineField({
      name: 'image',
      title: 'Logo Image',
      type: 'image',
      validation: Rule => Rule.required(),
      description: 'Transparent PNG/SVG preferred — rendered white on dark backgrounds',
    }),
    defineField({ name: 'url', title: 'Website URL', type: 'string', description: 'Optional — logo becomes a link when set' }),
  ],
  preview: {
    select: { title: 'name', media: 'image' },
  },
})
