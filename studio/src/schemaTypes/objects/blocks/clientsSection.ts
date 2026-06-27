import { defineField, defineType } from 'sanity'

export const clientsSection = defineType({
  name: 'clientsSection',
  title: 'Clients Section',
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'Section Label', type: 'string', description: 'e.g. "NAŠI KLIENTI"' }),
    defineField({ name: 'supportLabel', title: 'Support Label', type: 'string', description: 'e.g. "NAŠÍ tvorbu podporují"' }),
    defineField({
      name: 'clients',
      title: 'Clients',
      type: 'array',
      of: [{ type: 'clientItem' }],
    }),
  ],
  preview: {
    select: { title: 'label' },
    prepare({ title }) {
      return { title: `Clients: ${title ?? ''}` }
    },
  },
})
