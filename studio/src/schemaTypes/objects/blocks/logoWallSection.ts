import { defineField, defineType } from 'sanity'

export const logoWallSection = defineType({
  name: 'logoWallSection',
  title: 'Logo Wall Section',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', description: 'e.g. "NAŠI KLIENTI"' }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          { title: 'Grid', value: 'grid' },
          { title: 'Marquee', value: 'marquee' },
        ],
        layout: 'radio',
      },
      initialValue: 'grid',
    }),
    defineField({
      name: 'topRowLogos',
      title: 'Top Row Logos',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'brandLogo' }] }],
      description: 'Logos shown in the top row (marquee layout) — order here is the display order.',
    }),
    defineField({
      name: 'bottomRowLogos',
      title: 'Bottom Row Logos',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'brandLogo' }] }],
      description: 'Logos shown in the bottom row (marquee layout) — order here is the display order.',
    }),
  ],
  preview: {
    select: { title: 'title', top: 'topRowLogos', bottom: 'bottomRowLogos' },
    prepare({ title, top, bottom }) {
      const total = (top?.length ?? 0) + (bottom?.length ?? 0)
      return { title: `Logo Wall: ${title ?? ''}`, subtitle: `${total} logo(s)` }
    },
  },
})
