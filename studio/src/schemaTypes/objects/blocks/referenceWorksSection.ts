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
    defineField({
      name: 'projects',
      title: 'Projects',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'project' }] }],
      description: 'Pick and order which projects appear on the Reference page. Leave empty to show every project tagged with one of the Categories above instead.',
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: `Reference Works: ${title ?? ''}` }
    },
  },
})
