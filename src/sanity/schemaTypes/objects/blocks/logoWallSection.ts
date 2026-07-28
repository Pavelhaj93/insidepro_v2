import { defineField, defineType } from 'sanity'

export const logoWallSection = defineType({
  name: 'logoWallSection',
  title: 'Logo Wall Section',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', description: 'e.g. "NAŠI KLIENTI"' }),
    defineField({
      name: 'logos',
      title: 'Logos',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'brandLogo' }] }],
    }),
  ],
  preview: {
    select: { title: 'title', logos: 'logos' },
    prepare({ title, logos }) {
      return { title: `Logo Wall: ${title ?? ''}`, subtitle: `${logos?.length ?? 0} logo(s)` }
    },
  },
})
