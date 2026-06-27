import { defineField, defineType } from 'sanity'

export const filmShowcaseSection = defineType({
  name: 'filmShowcaseSection',
  title: 'Film Showcase Section',
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'Section Label', type: 'string', description: 'Small label, e.g. "AUTORSKÁ TVORBA"' }),
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({ name: 'introText', title: 'Intro Text', type: 'text', rows: 4 }),
    defineField({
      name: 'films',
      title: 'Films',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'film' }] }],
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: `Film Showcase: ${title ?? ''}` }
    },
  },
})
