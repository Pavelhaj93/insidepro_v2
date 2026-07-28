import { defineField, defineType } from 'sanity'

export const infoBoxSection = defineType({
  name: 'infoBoxSection',
  title: 'Info Box Section',
  type: 'object',
  fields: [
    defineField({ name: 'headline', title: 'Headline', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'headlineItalic', title: 'Italic Accent', type: 'string', description: 'Word(s) rendered in gold italic within the headline' }),
    defineField({ name: 'boxTitle', title: 'Box Title', type: 'string' }),
    defineField({
      name: 'boxDescription',
      title: 'Box Description',
      type: 'text',
      rows: 6,
      description: 'Separate paragraphs with a blank line',
    }),
  ],
  preview: {
    select: { title: 'headline' },
    prepare({ title }) {
      return { title: `Info Box: ${title ?? ''}` }
    },
  },
})
