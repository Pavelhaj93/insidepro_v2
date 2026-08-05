import Link from "next/link";
import {
  PortableText,
  type PortableTextBlock,
  type PortableTextComponents,
} from "next-sanity";
import { manrope } from "@/lib/fonts";
import { ArrowRightIcon } from "@/components/icons/ArrowRight";
import { Reveal, RevealItem, RevealStagger } from "@/components/motion/Reveal";

type ServiceItem = {
  number?: string;
  title: string;
  description?: PortableTextBlock[];
  linkLabel?: string;
  link?: string;
};

const headingComponents: PortableTextComponents = {
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
    gold: ({ children }) => <span className="text-brand-gold">{children}</span>,
    strong: ({ children }) => (
      <strong className="font-extrabold">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
  },
};

const descriptionComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p
        className={`${manrope.className} font-normal text-xl leading-snug tracking-normal text-white mb-4 last:mb-0`}
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

type Props = {
  label?: string;
  leftHeading?: PortableTextBlock[];
  items?: ServiceItem[];
};

export function ServicesListSection({
  label,
  leftHeading,
  items = [],
}: Props) {
  return (
    <section className="px-8 xl:px-0 pt-24 pb-12 max-w-7xl mx-auto">
      {label && (
        <p className="font-display font-medium text-base leading-none tracking-normal uppercase text-brand-gold mb-12">
          {label}
        </p>
      )}

      <div
        className={`grid gap-12 md:gap-20 ${leftHeading ? "md:grid-cols-2" : ""}`}
      >
        {/* Left: big heading */}
        {leftHeading && (
          <Reveal>
            <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl lg:text-[64px] leading-none tracking-normal uppercase text-brand-light">
              <PortableText value={leftHeading} components={headingComponents} />
            </h2>
          </Reveal>
        )}

        {/* Right: numbered items */}
        <RevealStagger className="flex flex-col">
          {items.map((item, i) => (
            <RevealItem
              key={i}
              className="group border-t border-brand-gold-light py-12"
            >
              <div className="flex gap-6">
                {item.number && (
                  <span className="font-display font-medium text-base leading-none tracking-normal uppercase text-brand-gold w-8 shrink-0 pt-1 transition-transform duration-300 group-hover:scale-125 group-hover:text-brand-light">
                    {item.number}
                  </span>
                )}
                <div className="flex-1">
                  <h3 className="font-display font-black text-xl sm:text-2xl md:text-3xl leading-none tracking-normal uppercase text-brand-light mb-4">
                    {item.title}
                  </h3>
                  {item.description && item.description.length > 0 && (
                    <PortableText
                      value={item.description}
                      components={descriptionComponents}
                    />
                  )}
                  {item.linkLabel && item.link && (
                    <div className="flex justify-end mt-6">
                      <Link
                        href={item.link}
                        className="font-display font-medium text-lg leading-relaxed tracking-normal uppercase text-brand-gold hover:text-brand-light/50 transition-colors flex items-center gap-3"
                      >
                        {item.linkLabel} <ArrowRightIcon />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
}
