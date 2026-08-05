import { defineField, defineType } from 'sanity'

export const servicesListSection = defineType({
  name: 'servicesListSection',
  title: 'Services List Section',
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'Section Label', type: 'string', description: 'Small label above the section, e.g. "CO DĚLÁME"' }),
    defineField({
      name: 'leftHeading',
      title: 'Left Heading',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [{ title: 'Normal', value: 'normal' }],
          lists: [],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
              { title: 'Gold', value: 'gold' },
            ],
            annotations: [],
          },
        },
      ],
      description: 'Select text and use the "Gold" mark to color it gold, or "Emphasis" for italic',
    }),
    defineField({
      name: 'items',
      title: 'Service Items',
      type: 'array',
      of: [{ type: 'serviceItem' }],
    }),
  ],
  preview: {
    select: { title: 'label' },
    prepare({ title }) {
      return { title: `Services: ${title ?? ''}` }
    },
  },
})
