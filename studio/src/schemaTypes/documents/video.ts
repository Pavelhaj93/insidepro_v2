import { defineField, defineType } from 'sanity'

export const video = defineType({
  name: 'video',
  title: 'Video',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Internal label only, so this video is easy to find and reference from other documents.',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'file',
      title: 'Video File',
      type: 'file',
      options: { accept: 'video/mp4,video/webm,video/quicktime' },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'poster',
      title: 'Poster Image (optional)',
      type: 'image',
      options: { hotspot: true },
      description: 'Shown before the video plays / while it loads.',
    }),
  ],
  preview: {
    select: { title: 'title', media: 'poster' },
  },
})
