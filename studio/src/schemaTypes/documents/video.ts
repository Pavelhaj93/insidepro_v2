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
      name: 'muxVideo',
      title: 'Video',
      type: 'mux.video',
      description: 'Uploaded to and streamed from Mux, not the Sanity CDN.',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'file',
      title: 'Video File (legacy)',
      type: 'file',
      options: { accept: 'video/mp4,video/webm,video/quicktime' },
      description: 'Pre-Mux upload, kept only until the Mux migration is verified in production.',
      hidden: true,
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
