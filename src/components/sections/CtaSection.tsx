import {
  PortableText,
  type PortableTextBlock,
  type PortableTextComponents,
} from "next-sanity";
import { urlFor } from "@/sanity/lib/image";
import { ParallaxBackgroundImage } from "@/components/motion/ParallaxBackgroundImage";
import { Reveal } from "@/components/motion/Reveal";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { BrandButton } from "@/components/ui/BrandButton";

type Props = {
  headline: PortableTextBlock[];
  backgroundImage?: { asset: { _ref: string }; lqip?: string };
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
            blurDataURL={backgroundImage.lqip}
          />
          <div className="absolute inset-0 bg-brand-black/60" />
        </>
      )}
      {!backgroundImage && <div className="absolute inset-0 bg-brand-dark" />}

      {/* <div className="relative z-10 max-w-5xl mx-auto text-center">
        <Reveal>
          <h2 className="font-display font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl uppercase leading-none text-brand-light mb-10">
            <PortableText value={headline} components={headlineComponents} />
          </h2>
        </Reveal>
        {buttonLabel && buttonLink && (
          <Reveal delay={0.15} className="inline-block">
            <MagneticButton>
              <BrandButton href={buttonLink} variant="gold">
                {buttonLabel}
              </BrandButton>
            </MagneticButton>
          </Reveal>
        )}
      </div> */}
    </section>
  );
}
