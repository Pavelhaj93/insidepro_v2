import { defineArrayMember, defineField, defineType } from 'sanity'

export const nsVideoGrid = defineType({
  name: 'nsVideoGrid',
  title: 'Mřížka videí',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Nadpis', type: 'string' }),
    defineField({
      name: 'videos',
      title: 'Videa',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'video' }] })],
    }),
  ],
  preview: {
    select: { title: 'heading', videos: 'videos' },
    prepare: ({ title, videos }) => ({
      title: title || 'Mřížka videí',
      subtitle: `Videí: ${videos?.length ?? 0}`,
    }),
  },
})
