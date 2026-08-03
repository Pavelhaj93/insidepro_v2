import Link from "next/link";
import {
  PortableText,
  type PortableTextBlock,
  type PortableTextComponents,
} from "next-sanity";
import { urlFor } from "@/sanity/lib/image";
import { ParallaxBackgroundImage } from "@/components/motion/ParallaxBackgroundImage";
import { Reveal } from "@/components/motion/Reveal";
import { MagneticButton } from "@/components/motion/MagneticButton";

type Props = {
  headline: PortableTextBlock[];
  backgroundImage?: { asset: { _ref: string } };
  buttonLabel?: string;
  buttonLink?: string;
};

const headlineComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <>{children}</>,
  },
  marks: {
    gold: ({ children }) => <span className="text-brand-gold">{children}</span>,
    strong: ({ children }) => (
      <strong className="font-extrabold">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
  },
};

export function CtaSection({
  headline,
  backgroundImage,
  buttonLabel,
  buttonLink,
}: Props) {
  return (
    <section className="relative overflow-hidden py-32 md:py-48 px-8 md:px-12">
      {backgroundImage && (
        <>
          <ParallaxBackgroundImage
            src={urlFor(backgroundImage).url()}
            intensity={10}
            sizes="110vw"
            quality={85}
          />
          <div className="absolute inset-0 bg-brand-black/60" />
        </>
      )}
      {!backgroundImage && <div className="absolute inset-0 bg-brand-dark" />}

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <Reveal>
          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl lg:text-7xl 2xl:text-7xl uppercase leading-none text-brand-light mb-10">
            <PortableText value={headline} components={headlineComponents} />
          </h2>
        </Reveal>
        {buttonLabel && buttonLink && (
          <Reveal delay={0.15} className="inline-block">
            <MagneticButton>
              <Link
                href={buttonLink}
                className="inline-block font-body text-sm tracking-widest uppercase px-8 py-4 border border-brand-light text-brand-light hover:bg-brand-light hover:text-brand-black transition-colors"
              >
                {buttonLabel}
              </Link>
            </MagneticButton>
          </Reveal>
        )}
      </div>
    </section>
  );
}
