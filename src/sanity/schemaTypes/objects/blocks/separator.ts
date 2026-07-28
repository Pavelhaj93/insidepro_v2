import { defineField, defineType } from 'sanity'

export const separator = defineType({
  name: 'separator',
  title: 'Separator',
  type: 'object',
  fields: [
    defineField({
      name: 'width',
      title: 'Width',
      type: 'string',
      options: {
        list: [
          { title: 'Full width', value: 'full' },
          { title: 'Half width', value: 'half' },
        ],
        layout: 'radio',
      },
      initialValue: 'full',
      validation: Rule => Rule.required(),
    }),
  ],
  preview: {
    select: { width: 'width' },
    prepare({ width }) {
      return { title: `Separator — ${width === 'half' ? 'half width' : 'full width'}` }
    },
  },
})
