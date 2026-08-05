import { defineField, defineType } from 'sanity'

export const referenceWorksSection = defineType({
  name: 'referenceWorksSection',
  title: 'Reference Works Section',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string', initialValue: 'REFERENCE' }),
    defineField({ name: 'allLabel', title: 'Label for the "All" tab', type: 'string', initialValue: 'Vše' }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'category' }] }],
      description: 'Pick which categories show up as filter tabs, in this order. Only projects tagged with one of these categories are shown.',
      validation: Rule => Rule.min(1).error('Pick at least one category'),
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: `Reference Works: ${title ?? ''}` }
    },
  },
})
