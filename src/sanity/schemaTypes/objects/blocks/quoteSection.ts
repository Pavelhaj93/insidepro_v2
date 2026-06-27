import { defineField, defineType } from 'sanity'

export const quoteSection = defineType({
  name: 'quoteSection',
  title: 'Quote / Highlight Section',
  type: 'object',
  fields: [
    defineField({ name: 'largeHeadline', title: 'Large Headline', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'largeHeadlineItalic', title: 'Italic Accent', type: 'string', description: 'Word(s) rendered in italic within the large headline' }),
    defineField({ name: 'quoteText', title: 'Quote / Body Text', type: 'text', rows: 4, description: 'Optional supporting quote or paragraph shown below the headline' }),
  ],
  preview: {
    select: { title: 'largeHeadline' },
    prepare({ title }) {
      return { title: `Quote: ${title}` }
    },
  },
})
