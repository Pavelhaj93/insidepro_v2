import { defineField, defineType } from 'sanity'

export const serviceItem = defineType({
  name: 'serviceItem',
  title: 'Service Item',
  type: 'object',
  fields: [
    defineField({ name: 'number', title: 'Number', type: 'string' }),
    defineField({ name: 'title', title: 'Title', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
    defineField({ name: 'linkLabel', title: 'Link Label', type: 'string', description: 'e.g. "REFERENCE" — link is shown only when both label and link are set' }),
    defineField({ name: 'link', title: 'Link', type: 'string', description: 'Internal path (e.g. /prace) or full URL' }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'number' },
    prepare({ title, subtitle }) {
      return { title, subtitle: `#${subtitle}` }
    },
  },
})
