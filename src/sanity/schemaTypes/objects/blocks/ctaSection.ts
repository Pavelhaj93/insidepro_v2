import { defineField, defineType } from 'sanity'

export const ctaSection = defineType({
  name: 'ctaSection',
  title: 'CTA Section',
  type: 'object',
  fields: [
    defineField({ name: 'headline', title: 'Headline', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'backgroundImage', title: 'Background Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'buttonLabel', title: 'Button Label', type: 'string' }),
    defineField({ name: 'buttonLink', title: 'Button Link', type: 'string', description: 'Internal path (e.g. /kontakt) or full URL' }),
  ],
  preview: {
    select: { title: 'headline', media: 'backgroundImage' },
    prepare({ title, media }) {
      return { title: `CTA: ${title}`, media }
    },
  },
})
