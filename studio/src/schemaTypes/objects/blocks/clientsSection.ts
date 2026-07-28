import { defineField, defineType } from 'sanity'

export const clientsSection = defineType({
  name: 'clientsSection',
  title: 'Clients Section',
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'Section Label', type: 'string', description: 'e.g. "NAŠI KLIENTI"' }),
    defineField({ name: 'supportLabel', title: 'Support Label', type: 'string', description: 'e.g. "NAŠÍ tvorbu podporují"' }),
    defineField({ name: 'showViewAllLink', title: 'Show "View All" Link', type: 'boolean', initialValue: true }),
    defineField({ name: 'viewAllLabel', title: 'View All Label', type: 'string', initialValue: 'ZOBRAZIT VŠE' }),
    defineField({ name: 'viewAllSlug', title: 'View All Link Path', type: 'string', initialValue: '/klienti' }),
    defineField({
      name: 'clients',
      title: 'Clients',
      type: 'array',
      of: [
        { type: 'clientItem' },
        { type: 'reference', title: 'Project', to: [{ type: 'project' }] },
      ],
      description: 'Inline client entries, or references to Project documents (name, image, quote and tagline are then taken from the project)',
    }),
  ],
  preview: {
    select: { title: 'label' },
    prepare({ title }) {
      return { title: `Clients: ${title ?? ''}` }
    },
  },
})
