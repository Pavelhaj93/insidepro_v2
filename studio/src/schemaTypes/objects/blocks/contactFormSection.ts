import { defineField, defineType } from "sanity";

export const contactFormSection = defineType({
  name: "contactFormSection",
  title: "Contact Form Section",
  type: "object",
  fields: [
    defineField({
      name: "headingLine1",
      title: "Heading Line 1",
      type: "string",
      initialValue: "Řekněte nám",
    }),
    defineField({
      name: "headingLine2",
      title: "Heading Line 2",
      type: "string",
      initialValue: "o svém projektu",
    }),
    defineField({
      name: "introText",
      title: "Intro Text",
      type: "text",
      rows: 3,
      initialValue: "Pár řádků stačí. Ozveme se vám do dvou pracovních dnů.",
    }),
    defineField({
      name: "successMessage",
      title: "Success Message",
      type: "text",
      rows: 2,
      initialValue: "Ozveme se vám co nejdřív zpátky.",
    }),
  ],
  preview: {
    select: { title: "headingLine1" },
    prepare({ title }) {
      return { title: `Contact Form: ${title ?? ""}` };
    },
  },
});
