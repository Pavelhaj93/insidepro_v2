import { defineField, defineType } from 'sanity'

export const processSection = defineType({
  name: 'processSection',
  title: 'Process Section',
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'Section Label', type: 'string', description: 'Small label, e.g. "JAK PRACUJEME"' }),
    defineField({
      name: 'steps',
      title: 'Steps',
      type: 'array',
      of: [{ type: 'processStep' }],
    }),
  ],
  preview: {
    select: { title: 'label' },
    prepare({ title }) {
      return { title: `Process: ${title ?? ''}` }
    },
  },
})
