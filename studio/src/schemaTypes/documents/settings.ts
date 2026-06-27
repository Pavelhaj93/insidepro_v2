import { defineField, defineType } from 'sanity'

export const settings = defineType({
  name: 'settings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Site Title', type: 'string' }),
    defineField({ name: 'description', title: 'Site Description', type: 'text', rows: 3 }),
    defineField({ name: 'logoText', title: 'Logo Text (fallback)', type: 'string', initialValue: 'IN', description: 'Shown when no logo image is uploaded' }),
    defineField({ name: 'logo', title: 'Logo Image', type: 'image', description: 'Upload an SVG or PNG — overrides the logo text above' }),
    defineField({
      name: 'socialLinks',
      title: 'Social Media Links',
      type: 'object',
      fields: [
        defineField({ name: 'instagram', title: 'Instagram', type: 'url' }),
        defineField({ name: 'linkedin', title: 'LinkedIn', type: 'url' }),
        defineField({ name: 'facebook', title: 'Facebook', type: 'url' }),
        defineField({ name: 'vimeo', title: 'Vimeo', type: 'url' }),
      ],
    }),
  ],
})
