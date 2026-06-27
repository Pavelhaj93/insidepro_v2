import { defineField, defineType } from 'sanity'

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: Rule => Rule.required(), group: 'content' }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' }, validation: Rule => Rule.required(), group: 'content' }),
    defineField({ name: 'isHomepage', title: 'Is Homepage', type: 'boolean', initialValue: false, description: 'Mark this page as the homepage (only one page should have this enabled)', group: 'content' }),
    defineField({
      name: 'blocks',
      title: 'Page Blocks',
      type: 'array',
      group: 'content',
      of: [
        { type: 'heroSection' },
        { type: 'servicesListSection' },
        { type: 'featuredWorksSection' },
        { type: 'ctaSection' },
        { type: 'quoteSection' },
        { type: 'processSection' },
        { type: 'twoColumnSection' },
        { type: 'teamSection' },
        { type: 'filmShowcaseSection' },
        { type: 'clientsSection' },
      ],
    }),
    defineField({ name: 'seoTitle', title: 'SEO Title', type: 'string', group: 'seo' }),
    defineField({ name: 'seoDescription', title: 'SEO Description', type: 'text', rows: 2, group: 'seo' }),
    defineField({ name: 'seoImage', title: 'OG Image', type: 'image', group: 'seo' }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'slug.current', isHomepage: 'isHomepage' },
    prepare({ title, subtitle, isHomepage }) {
      return { title: isHomepage ? `🏠 ${title}` : title, subtitle: `/${subtitle}` }
    },
  },
})
