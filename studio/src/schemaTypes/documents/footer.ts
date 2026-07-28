import { defineField, defineType } from 'sanity'

export const footer = defineType({
  name: 'footer',
  title: 'Footer',
  type: 'document',
  fields: [
    defineField({ name: 'headingLine1', title: 'Heading — Line 1', type: 'string', initialValue: 'Máte projekt?' }),
    defineField({ name: 'headingLine2', title: 'Heading — Line 2', type: 'string', initialValue: 'Pojďme na to' }),
    defineField({
      name: 'headingHighlight',
      title: 'Heading — Highlighted Word',
      type: 'string',
      initialValue: 'Pojďme',
      description: 'Word within Line 2 rendered in italic gold. Must match the text in Line 2 exactly.',
    }),
    defineField({ name: 'backgroundImage', title: 'Background Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'email', title: 'Email', type: 'string', validation: Rule => Rule.email() }),
    defineField({ name: 'phone', title: 'Phone', type: 'string' }),
    defineField({
      name: 'copyrightText',
      title: 'Copyright Text',
      type: 'string',
      initialValue: 'R&T Production s.r.o. - All rights reserved.',
      description: 'Rendered as "© {current year} {this text}"',
    }),
    defineField({
      name: 'legalText',
      title: 'Legal / Registration Text',
      type: 'text',
      rows: 2,
      initialValue: 'Společnost je zapsána v obchodním rejstříku vedeném Krajským soudem v Hradci Králové, oddíl C, vložka 35789 / IČ: 02146142.',
    }),
  ],
})
