import { defineField, defineType } from 'sanity'

export const featureCardsSection = defineType({
  name: 'featureCardsSection',
  title: 'Feature Cards Section',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string', description: 'Optional heading above the cards' }),
    defineField({
      name: 'cards',
      title: 'Cards',
      type: 'array',
      of: [{ type: 'featureCard' }],
    }),
  ],
  preview: {
    select: { title: 'heading', cards: 'cards' },
    prepare({ title, cards }) {
      return { title: `Feature Cards: ${title ?? `${cards?.length ?? 0} card(s)`}` }
    },
  },
})
