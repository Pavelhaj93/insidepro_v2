import { defineArrayMember, defineField, defineType } from 'sanity'

export const featureCard = defineType({
  name: 'featureCard',
  title: 'Feature Card',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: Rule => Rule.required() }),
    defineField({
      name: 'bullets',
      title: 'Bullet Points',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'bullet',
          title: 'Bullet',
          type: 'object',
          fields: [
            defineField({
              name: 'text',
              title: 'Text',
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
              description: 'Select text and use the "Gold" mark to color it gold — unmarked text renders white',
            }),
          ],
          preview: {
            select: { text: 'text' },
            prepare({ text }) {
              const plain = (text ?? [])
                .flatMap((block: { children?: { text?: string }[] }) => block.children ?? [])
                .map((child: { text?: string }) => child.text ?? '')
                .join('')
              return { title: plain || 'Empty bullet' }
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'title', bullets: 'bullets' },
    prepare({ title, bullets }) {
      return { title, subtitle: `${bullets?.length ?? 0} bullet(s)` }
    },
  },
})
