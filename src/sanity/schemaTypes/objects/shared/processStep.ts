import { defineField, defineType } from 'sanity'

export const processStep = defineType({
  name: 'processStep',
  title: 'Process Step',
  type: 'object',
  fields: [
    defineField({ name: 'number', title: 'Step Number', type: 'string' }),
    defineField({ name: 'title', title: 'Title', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'number' },
    prepare({ title, subtitle }) {
      return { title, subtitle: `Step ${subtitle}` }
    },
  },
})
