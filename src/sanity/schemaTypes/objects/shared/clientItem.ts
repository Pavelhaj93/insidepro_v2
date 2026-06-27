import { defineField, defineType } from 'sanity'

export const clientItem = defineType({
  name: 'clientItem',
  title: 'Client',
  type: 'object',
  fields: [
    defineField({ name: 'name', title: 'Client Name', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'logo', title: 'Logo', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'url', title: 'Website URL', type: 'url' }),
  ],
  preview: {
    select: { title: 'name', media: 'logo' },
  },
})
