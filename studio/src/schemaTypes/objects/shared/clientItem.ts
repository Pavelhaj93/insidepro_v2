import { defineField, defineType } from "sanity";

export const clientItem = defineType({
  name: "clientItem",
  title: "Client",
  type: "object",
  fields: [
    defineField({
      name: "name",
      title: "Client Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({ name: "url", title: "Website URL", type: "url" }),
    defineField({
      name: "backgroundImage",
      title: "Background Image",
      type: "image",
      options: { hotspot: true },
      description: "Full-bleed photo for the showcase slide",
    }),
    defineField({
      name: "quote",
      title: "Quote",
      type: "string",
      description: "Large headline text shown at top of dark card",
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      description: "Small uppercase line shown below the client name",
    }),
  ],
  preview: {
    select: { title: "name", media: "logo" },
  },
});
