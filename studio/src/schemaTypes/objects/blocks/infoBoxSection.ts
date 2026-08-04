import {
  defineField,
  defineType,
  isPortableTextSpan,
  isPortableTextTextBlock,
  type PortableTextBlock,
} from 'sanity'

const blockToPlainText = (block: PortableTextBlock): string =>
  isPortableTextTextBlock(block)
    ? block.children
        .filter(isPortableTextSpan)
        .map(child => child.text)
        .join('')
    : ''

export const infoBoxSection = defineType({
  name: 'infoBoxSection',
  title: 'Info Box Section',
  type: 'object',
  fields: [
    defineField({
      name: 'headline',
      title: 'Headline',
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
      validation: Rule => Rule.required(),
      description:
        'Use "Gold" to color text gold, and start a new paragraph (Enter) to break onto the next line.',
    }),
    defineField({ name: 'boxTitle', title: 'Box Title', type: 'string' }),
    defineField({
      name: 'boxDescription',
      title: 'Box Description',
      type: 'text',
      rows: 6,
      description: 'Separate paragraphs with a blank line',
    }),
  ],
  preview: {
    select: { title: 'headline' },
    prepare({ title }) {
      const blocks = (title ?? []) as PortableTextBlock[]
      const headlineText = blocks.map(blockToPlainText).join(' ')
      return { title: `Info Box: ${headlineText}` }
    },
  },
})
