import { defineField, defineType } from 'sanity'

export const servicesListSection = defineType({
  name: 'servicesListSection',
  title: 'Services List Section',
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'Section Label', type: 'string', description: 'Small label above the section, e.g. "CO DĚLÁME"' }),
    defineField({ name: 'leftHeading', title: 'Left Heading', type: 'string' }),
    defineField({ name: 'leftHeadingItalic', title: 'Left Heading Italic Part', type: 'string', description: 'The word(s) rendered in italic within the left heading' }),
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
