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

export const ctaSection = defineType({
  name: 'ctaSection',
  title: 'CTA Section',
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
      description: 'Select text and use the "Gold" mark to color it gold',
    }),
    defineField({ name: 'backgroundImage', title: 'Background Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'buttonLabel', title: 'Button Label', type: 'string' }),
    defineField({ name: 'buttonLink', title: 'Button Link', type: 'string', description: 'Internal path (e.g. /kontakt) or full URL' }),
  ],
  preview: {
    select: { title: 'headline', media: 'backgroundImage' },
    prepare({ title, media }) {
      const blocks = (title ?? []) as PortableTextBlock[]
      const headlineText = blocks.map(blockToPlainText).join(' ')
      return { title: `CTA: ${headlineText}`, media }
    },
  },
})
