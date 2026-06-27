import { defineField, defineType } from 'sanity'

export const quoteSection = defineType({
  name: 'quoteSection',
  title: 'Quote / Highlight Section',
  type: 'object',
  fields: [
    defineField({ name: 'largeHeadline', title: 'Large Headline', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'largeHeadlineItalic', title: 'Italic Accent', type: 'string', description: 'Word(s) rendered in italic within the large headline' }),
    defineField({ name: 'quoteBoldText', title: 'Quote — Bold line', type: 'string', description: 'Rendered in Manrope ExtraBold (800)' }),
    defineField({ name: 'quoteRegularText', title: 'Quote — Regular line', type: 'string', description: 'Rendered in Manrope Regular (400)' }),
  ],
  preview: {
    select: { title: 'largeHeadline' },
    prepare({ title }) {
      return { title: `Quote: ${title}` }
    },
  },
})
