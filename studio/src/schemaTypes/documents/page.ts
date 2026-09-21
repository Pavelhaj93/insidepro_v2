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
    defineField({ name: 'isPublished', title: 'Published', type: 'boolean', initialValue: true, description: 'Turn off to keep this page out of the live site and out of the build — its content stays saved here, it just won’t be reachable at its URL until you switch this back on.', group: 'content' }),
    defineField({
      name: 'blocks',
      title: 'Page Blocks',
      type: 'array',
      group: 'content',
      of: [
        { type: 'heroSection' },
        { type: 'splitVideoRevealSection' },
        { type: 'servicesListSection' },
        { type: 'servicesAccordionSection' },
        { type: 'whoWeAreSection' },
        { type: 'zoomTextSection' },
        { type: 'featuredWorksSection' },
        { type: 'referenceWorksSection' },
        { type: 'ctaSection' },
        { type: 'quoteSection' },
        { type: 'processSection' },
        { type: 'twoColumnSection' },
        { type: 'teamSection' },
        { type: 'filmShowcaseSection' },
        { type: 'clientsSection' },
        { type: 'imageSection' },
        { type: 'infoBoxSection' },
        { type: 'featureCardsSection' },
        { type: 'richTextSection' },
        { type: 'logoWallSection' },
        { type: 'textBlock' },
        { type: 'separator' },
        { type: 'contactFormSection' },
      ],
    }),
    defineField({ name: 'seoTitle', title: 'SEO Title', type: 'string', group: 'seo' }),
    defineField({ name: 'seoDescription', title: 'SEO Description', type: 'text', rows: 2, group: 'seo' }),
    defineField({ name: 'seoImage', title: 'OG Image', type: 'image', group: 'seo' }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'slug.current', isHomepage: 'isHomepage', isPublished: 'isPublished' },
    prepare({ title, subtitle, isHomepage, isPublished }) {
      const prefix = isHomepage ? '🏠 ' : isPublished === false ? '🚫 ' : ''
      return { title: `${prefix}${title}`, subtitle: `/${subtitle}` }
    },
  },
})
