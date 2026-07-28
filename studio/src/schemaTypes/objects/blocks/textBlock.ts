import { defineField, defineType } from 'sanity'

export const textBlock = defineType({
  name: 'textBlock',
  title: 'Text Block',
  type: 'object',
  fields: [
    defineField({ name: 'number', title: 'Number', type: 'string', description: 'Optional index shown at the far left, e.g. "01"' }),
    defineField({ name: 'title', title: 'Title', type: 'string', description: 'Heading shown at the top left' }),
    defineField({
      name: 'body',
      title: 'Body',
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
      description: 'Paragraphs render with spacing between them; select text and use the "Gold" mark to color it gold',
    }),
  ],
  preview: {
    select: { title: 'title', number: 'number' },
    prepare({ title, number }) {
      return { title: `Text Block: ${number ? `${number} ` : ''}${title ?? ''}` }
    },
  },
})
