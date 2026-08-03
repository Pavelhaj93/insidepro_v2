import { defineField, defineType } from 'sanity'

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
      const headlineText = Array.isArray(title)
        ? title
            .map(block => block.children?.map(child => child.text).join('') ?? '')
            .join(' ')
        : title
      return { title: `CTA: ${headlineText}`, media }
    },
  },
})
