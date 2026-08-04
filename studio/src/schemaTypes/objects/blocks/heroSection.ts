import {
  defineField,
  defineType,
  isPortableTextSpan,
  isPortableTextTextBlock,
  type PortableTextBlock,
} from "sanity";

const blockToPlainText = (block: PortableTextBlock): string =>
  isPortableTextTextBlock(block)
    ? block.children
        .filter(isPortableTextSpan)
        .map((child) => child.text)
        .join("")
    : "";

export const heroSection = defineType({
  name: "heroSection",
  title: "Hero Section",
  type: "object",
  fields: [
    defineField({
      name: "backgroundImage",
      title: "Background Image",
      type: "image",
      options: { hotspot: true },
      description:
        "Always required as the poster frame — shown instantly while the background video (if any) loads in behind it.",
    }),
    defineField({
      name: "backgroundImageMobile",
      title: "Background Image — Mobile (optional)",
      type: "image",
      options: { hotspot: true },
      description:
        "Optional portrait-framed poster used on narrow screens instead of cropping the desktop image. Falls back to the image above if left empty.",
    }),
    defineField({
      name: "backgroundVideo",
      title: "Background Video (optional)",
      type: "file",
      options: { accept: "video/mp4,video/webm" },
      description:
        "Short, muted, looping background clip, landscape framing (e.g. 16:9). Used on all screens unless a mobile-specific clip is set below. Compress before uploading — see docs/features for the recommended ffmpeg command. If empty, the background image is used alone.",
    }),
    defineField({
      name: "backgroundVideoMobile",
      title: "Background Video — Mobile (optional)",
      type: "file",
      options: { accept: "video/mp4,video/webm" },
      description:
        "Optional portrait-framed clip (e.g. 9:16), swapped in automatically on narrow screens instead of cropping the desktop video. Falls back to the video above if left empty.",
    }),
    defineField({
      name: "headline",
      title: "Headline",
      type: "array",
      of: [
        {
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
          lists: [],
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
              { title: "Gold", value: "gold" },
            ],
            annotations: [],
          },
        },
      ],
      description:
        'Use "Gold" to color text gold, and start a new paragraph (Enter) to break onto the next line.',
    }),
    defineField({ name: "subtitle", title: "Subtitle", type: "string" }),
    defineField({
      name: "showScrollIndicator",
      title: "Show Scroll Indicator",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "showSocialIcons",
      title: "Show Social Icons",
      type: "boolean",
      initialValue: false,
      description: "Display social media links in the bottom-right corner",
    }),
  ],
  preview: {
    select: { title: "headline", media: "backgroundImage" },
    prepare({ title, media }) {
      const blocks = (title ?? []) as PortableTextBlock[];
      const headlineText = blocks.map(blockToPlainText).join(" ");
      return { title: `Hero: ${headlineText}`, media };
    },
  },
});
