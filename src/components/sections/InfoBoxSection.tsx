import {
  PortableText,
  type PortableTextBlock,
  type PortableTextComponents,
} from "next-sanity";
import { manrope } from "@/lib/fonts";
import { Reveal } from "@/components/motion/Reveal";

type Props = {
  headline: PortableTextBlock[];
  boxTitle?: string;
  boxDescription?: string;
};

const headlineComponents: PortableTextComponents = {
  block: {
    normal: ({ children, index }) =>
      index > 0 ? (
        <>
          <br />
          {children}
        </>
      ) : (
        <>{children}</>
      ),
  },
  marks: {
    gold: ({ children }) => (
      <span className="text-brand-gold">{children}</span>
    ),
    strong: ({ children }) => (
      <strong className="font-extrabold">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
  },
};

export function InfoBoxSection({ headline, boxTitle, boxDescription }: Props) {
  const hasBox = boxTitle || boxDescription;

  return (
    <section className="px-8 xl:px-0 py-24 max-w-7xl mx-auto">
      <Reveal>
        <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl lg:text-7xl leading-tight uppercase text-brand-light text-center max-w-5xl mx-auto">
          <PortableText value={headline} components={headlineComponents} />
        </h2>
      </Reveal>

      {hasBox && (
        <Reveal
          delay={0.15}
          className="bg-brand-grey px-6 py-8 md:px-12 md:py-10 mt-16 md:mt-24 rounded-md"
        >
          <div className="h-px bg-brand-gold-light w-1/2 mb-8" />
          {boxTitle && (
            <h3 className="font-display font-black text-xl md:text-2xl leading-snug tracking-normal uppercase text-brand-gold mb-6">
              {boxTitle}
            </h3>
          )}
          {boxDescription && (
            <p
              className={`${manrope.className} font-normal text-lg leading-relaxed tracking-normal text-brand-light whitespace-pre-line max-w-4xl`}
            >
              {boxDescription}
            </p>
          )}
        </Reveal>
      )}
    </section>
  );
}
