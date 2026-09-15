import { defineField, defineType } from 'sanity'

export const zoomTextSection = defineType({
  name: 'zoomTextSection',
  title: 'Zoom Text Transition Section',
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'Label (optional)', type: 'string' }),
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      validation: Rule => Rule.required(),
      description: 'The large headline that scales up as the visitor scrolls.',
    }),
    defineField({
      name: 'accentColor',
      title: 'Accent Color',
      type: 'string',
      options: {
        list: [
          { title: 'Light', value: 'var(--color-brand-light)' },
          { title: 'Gold', value: 'var(--color-brand-gold)' },
          { title: 'Bronze', value: 'var(--color-brand-bronze)' },
        ],
      },
      initialValue: 'var(--color-brand-light)',
    }),
    defineField({
      name: 'anchorIndex',
      title: 'Anchor Character Index (advanced)',
      type: 'number',
      description:
        'Index of the character the zoom effect scales around. Defaults to the character nearest the middle of the headline; override if that lands on an accented character or a space. Update this if you change the headline text.',
    }),
  ],
  preview: {
    select: { title: 'headline' },
    prepare({ title }) {
      return { title: `Zoom Text: ${title ?? ''}` }
    },
  },
})
