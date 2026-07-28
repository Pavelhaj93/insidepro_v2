import {
  PortableText,
  type PortableTextBlock,
  type PortableTextComponents,
} from "next-sanity";
import { manrope } from "@/lib/fonts";

type Props = {
  number?: string;
  title?: string;
  body?: PortableTextBlock[];
};

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p
        className={`${manrope.className} font-normal text-lg leading-relaxed tracking-normal text-brand-light mb-6 last:mb-0`}
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

export function TextBlockSection({ number, title, body }: Props) {
  if (!title && !body?.length) return null;

  return (
    <section className="bg-black px-8 xl:px-0 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-[3rem_1fr] md:grid-cols-[6rem_1fr] gap-x-4 md:gap-x-8">
          <span className="font-display font-bold text-base leading-8 text-brand-gold">
            {number}
          </span>
          <div className="max-w-3xl">
            {title && (
              <h2 className="font-display font-black text-xl md:text-2xl leading-8 tracking-normal uppercase text-brand-light mb-8">
                {title}
              </h2>
            )}
            {body && body.length > 0 && (
              <PortableText value={body} components={components} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
