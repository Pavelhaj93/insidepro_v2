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

export const splitVideoRevealSection = defineType({
  name: 'splitVideoRevealSection',
  title: 'Split Video Reveal Section',
  type: 'object',
  fields: [
    defineField({ name: 'kicker', title: 'Kicker', type: 'string', description: 'Small label above the headline, e.g. "From the inside"' }),
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
      description: 'Use "Gold" to color text gold, and start a new paragraph (Enter) to break onto the next line.',
    }),
    defineField({ name: 'subtitle', title: 'Subtitle', type: 'string' }),
    defineField({
      name: 'cornerHeadline',
      title: 'Corner Headline',
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
      description: 'The small headline shown in the bottom-right corner card, e.g. "Tvoříme věci, které inspirují"',
    }),
    defineField({
      name: 'video',
      title: 'Video',
      type: 'file',
      options: { accept: 'video/mp4,video/webm' },
      validation: Rule => Rule.required(),
      description: 'The scroll-revealed split-panel video, landscape framing.',
    }),
    defineField({
      name: 'mobileVideo',
      title: 'Video — Mobile (optional)',
      type: 'file',
      options: { accept: 'video/mp4,video/webm' },
      description: 'Optional portrait-framed clip swapped in on narrow screens. Falls back to the video above if left empty.',
    }),
    defineField({
      name: 'posterImage',
      title: 'Poster Image (optional)',
      type: 'image',
      options: { hotspot: true },
      description: 'Shown instantly while the video loads in behind it.',
    }),
    defineField({
      name: 'buttonLabel',
      title: 'Button Label (optional)',
      type: 'string',
      initialValue: 'Kontakt',
    }),
    defineField({
      name: 'buttonLink',
      title: 'Button Link (optional)',
      type: 'string',
      initialValue: '#kontakt',
      description: 'In-page anchor (e.g. #kontakt) or a full URL/path.',
    }),
  ],
  preview: {
    select: { title: 'headline', media: 'posterImage' },
    prepare({ title, media }) {
      const blocks = (title ?? []) as PortableTextBlock[]
      const headlineText = blocks.map(blockToPlainText).join(' ')
      return { title: `Split Video Reveal: ${headlineText}`, media }
    },
  },
})
