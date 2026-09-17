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

export const whoWeAreSection = defineType({
  name: 'whoWeAreSection',
  title: 'Who We Are Section',
  type: 'object',
  fields: [
    defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string', description: 'Small label above the heading' }),
    defineField({
      name: 'heading',
      title: 'Heading',
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
      description: 'Use "Gold" to color text gold, and start a new paragraph (Enter) to break onto the next line.',
    }),
    defineField({ name: 'missionText', title: 'Mission Text', type: 'text', rows: 4 }),
    defineField({
      name: 'leftPhotos',
      title: 'Left Photo Carousel',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
    defineField({ name: 'rightImage', title: 'Right Image', type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'badgeText',
      title: 'Badge Text',
      type: 'string',
      description: 'Short phrase repeated around the rotating circular badge',
    }),
  ],
  preview: {
    select: { title: 'heading', media: 'rightImage' },
    prepare({ title, media }) {
      const blocks = (title ?? []) as PortableTextBlock[]
      const headingText = blocks.map(blockToPlainText).join(' ')
      return { title: `Who We Are: ${headingText}`, media }
    },
  },
})
