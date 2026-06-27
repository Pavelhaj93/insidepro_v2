import { defineField, defineType } from 'sanity'

export const featuredWorksSection = defineType({
  name: 'featuredWorksSection',
  title: 'Featured Works Section',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string', initialValue: 'VYBRANÉ PRÁCE' }),
    defineField({ name: 'showViewAllLink', title: 'Show "View All" Link', type: 'boolean', initialValue: true }),
    defineField({ name: 'viewAllLabel', title: 'View All Label', type: 'string', initialValue: 'ZOBRAZIT VŠE' }),
    defineField({ name: 'viewAllSlug', title: 'View All Link Path', type: 'string', initialValue: '/prace' }),
    defineField({
      name: 'projects',
      title: 'Projects',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'project' }] }],
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: `Featured Works: ${title ?? ''}` }
    },
  },
})
