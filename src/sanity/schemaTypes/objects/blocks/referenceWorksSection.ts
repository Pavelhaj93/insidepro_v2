import { defineField, defineType } from 'sanity'

export const referenceWorksSection = defineType({
  name: 'referenceWorksSection',
  title: 'Reference Works Section',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string', initialValue: 'REFERENCE' }),
    defineField({ name: 'allLabel', title: 'Label for the "All" tab', type: 'string', initialValue: 'Vše' }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: `Reference Works: ${title ?? ''}` }
    },
  },
})
