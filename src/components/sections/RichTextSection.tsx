import {
  PortableText,
  type PortableTextBlock,
  type PortableTextComponents,
} from "next-sanity";
import { manrope } from "@/lib/fonts";

type Props = {
  title?: string;
  body?: PortableTextBlock[];
};

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p
        className={`${manrope.className} font-normal text-[18px] leading-[30.3px] tracking-normal text-brand-light max-w-4xl mx-auto mb-6 last:mb-0`}
      >
        {children}
      </p>
    ),
  },
  marks: {
    gold: ({ children }) => <span className="text-brand-gold">{children}</span>,
    strong: ({ children }) => (
      <strong className="font-extrabold">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
  },
};

export function RichTextSection({ title, body }: Props) {
  if (!title && !body?.length) return null;

  return (
    <section className="px-8 md:px-0 py-8 max-w-7xl mx-auto">
      <div className="bg-black px-6 py-10 md:px-12 md:py-12 text-center">
        {title && (
          <h2 className="font-display font-black text-xl md:text-2xl leading-snug tracking-normal uppercase text-brand-gold mb-8">
            {title}
          </h2>
        )}
        {body && body.length > 0 && (
          <PortableText value={body} components={components} />
        )}
      </div>
    </section>
  );
}
