import { defineField, defineType } from 'sanity'

export const heroSection = defineType({
  name: 'heroSection',
  title: 'Hero Section',
  type: 'object',
  fields: [
    defineField({ name: 'backgroundImage', title: 'Background Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'headline', title: 'Headline', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'headlineItalic', title: 'Headline Italic Accent', type: 'string', description: 'Optional word/phrase rendered in italic within the headline' }),
    defineField({ name: 'subtitle', title: 'Subtitle', type: 'string' }),
    defineField({ name: 'showScrollIndicator', title: 'Show Scroll Indicator', type: 'boolean', initialValue: true }),
    defineField({ name: 'showSocialIcons', title: 'Show Social Icons', type: 'boolean', initialValue: false, description: 'Display social media links in the bottom-right corner' }),
  ],
  preview: {
    select: { title: 'headline', media: 'backgroundImage' },
    prepare({ title, media }) {
      return { title: `Hero: ${title}`, media }
    },
  },
})
