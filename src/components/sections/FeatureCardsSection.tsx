import {
  PortableText,
  type PortableTextBlock,
  type PortableTextComponents,
} from "next-sanity";
import { manrope } from "@/lib/fonts";

type FeatureBullet = {
  _key: string;
  text?: PortableTextBlock[];
};

type FeatureCard = {
  _key: string;
  title: string;
  bullets?: FeatureBullet[];
};

type Props = {
  heading?: string;
  cards?: FeatureCard[];
};

const bulletComponents: PortableTextComponents = {
  block: {
    // each paragraph (Enter) renders as its own line within the bullet;
    // soft breaks (Shift+Enter) become <br/> automatically
    normal: ({ children }) => <span className="block">{children}</span>,
  },
  marks: {
    gold: ({ children }) => <span className="text-brand-gold">{children}</span>,
    strong: ({ children }) => (
      <strong className="font-extrabold">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
  },
};

export function FeatureCardsSection({ heading, cards = [] }: Props) {
  if (!cards.length) return null;

  return (
    <section className="px-8 xl:px-0 py-24 max-w-7xl mx-auto">
      {heading && (
        <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl lg:text-7xl leading-tight tracking-normal uppercase text-brand-light mb-12">
          {heading}
        </h2>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {cards.map((card) => (
          <div
            key={card._key}
            className="bg-brand-grey px-8 py-10 flex flex-col rounded-md"
          >
            <h3 className="font-display font-black text-2xl leading-tight tracking-normal uppercase text-brand-light text-center">
              {card.title}
            </h3>
            <div className="h-px bg-brand-gold-light my-6" />
            {card.bullets && card.bullets.length > 0 && (
              <ul className="space-y-4">
                {card.bullets.map((bullet) => (
                  <li key={bullet._key} className="flex items-start gap-3">
                    <span className="mt-2.5 h-1 w-1 rounded-full bg-brand-gold shrink-0" />
                    <span
                      className={`${manrope.className} font-normal text-base leading-relaxed tracking-normal text-brand-light`}
                    >
                      {bullet.text && (
                        <PortableText
                          value={bullet.text}
                          components={bulletComponents}
                        />
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
