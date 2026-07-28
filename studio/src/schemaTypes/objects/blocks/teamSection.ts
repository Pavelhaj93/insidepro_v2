import { defineField, defineType } from 'sanity'

export const teamSection = defineType({
  name: 'teamSection',
  title: 'Team Section',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({
      name: 'teamMembers',
      title: 'Team Members',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'teamMember' }] }],
    }),
    defineField({ name: 'outroText', title: 'Outro Text', type: 'text', rows: 3 }),
    defineField({
      name: 'outroHighlight',
      title: 'Outro Highlight',
      type: 'string',
      description: 'Gold-colored sentence after the outro text (e.g. "Chtěli byste s námi spolupracovat?")',
    }),
    defineField({ name: 'ctaLabel', title: 'CTA Label', type: 'string' }),
    defineField({
      name: 'ctaLink',
      title: 'CTA Link',
      type: 'string',
      description: 'Internal path (e.g. /kontakt) or full URL',
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: `Team: ${title ?? ''}` }
    },
  },
})
