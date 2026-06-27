import { defineField, defineType } from 'sanity'

export const twoColumnSection = defineType({
  name: 'twoColumnSection',
  title: 'Two Column Section',
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'Section Label', type: 'string' }),
    defineField({ name: 'leftHeading', title: 'Left Heading', type: 'string' }),
    defineField({ name: 'leftHeadingItalic', title: 'Left Heading Italic Part', type: 'string', description: 'Word(s) rendered in italic within the left heading' }),
    defineField({ name: 'rightBodyText', title: 'Right Body Text', type: 'text', rows: 6 }),
  ],
  preview: {
    select: { title: 'leftHeading' },
    prepare({ title }) {
      return { title: `Two Column: ${title ?? ''}` }
    },
  },
})
