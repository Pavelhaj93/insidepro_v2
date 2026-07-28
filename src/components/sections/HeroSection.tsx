import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { ScrollIndicatorButton } from "./ScrollIndicatorButton";
import { SocialLinks } from "@/components/layout/SocialLinks";
import { ParallaxLayer } from "@/components/motion/ParallaxLayer";
import { Reveal } from "@/components/motion/Reveal";
import { client } from "@/sanity/lib/client";
import { settingsQuery } from "@/sanity/lib/queries";

type Props = {
  backgroundImage?: { asset: { _ref: string } };
  headline: string;
  headlineItalic?: string;
  subtitle?: string;
  showScrollIndicator?: boolean;
  showSocialIcons?: boolean;
};

export async function HeroSection({
  backgroundImage,
  headline,
  headlineItalic,
  subtitle,
  showScrollIndicator = true,
  showSocialIcons = false,
}: Props) {
  const parts = headlineItalic ? headline.split(headlineItalic) : [headline];

  const socialLinks = showSocialIcons
    ? ((await client.fetch(settingsQuery))?.socialLinks ?? null)
    : null;

  return (
    <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background image */}
      {backgroundImage && (
        <>
          <ParallaxLayer intensity={12}>
            <Image
              src={urlFor(backgroundImage).width(1920).height(1080).url()}
              alt=""
              fill
              sizes="100vw"
              className="object-cover object-center"
              priority
            />
          </ParallaxLayer>
          <div className="absolute inset-0 bg-linear-to-b from-brand-black/40 via-brand-black/20 to-brand-black/70" />
        </>
      )}
      {!backgroundImage && <div className="absolute inset-0 bg-brand-black" />}

      {/* Content — centered */}
      <div className="relative z-10 top-10 px-8 md:px-12 w-full text-center max-w-7xl">
        <Reveal duration={0.9}>
          <h1 className="font-display font-black text-5xl leading-tight sm:text-6xl md:text-7xl lg:text-9xl tracking-normal uppercase text-brand-light">
            {headlineItalic && parts[0] !== undefined ? (
              <>
                {parts[0]}
                <em className="italic text-brand-gold">{headlineItalic}</em>
                {parts[1]}
              </>
            ) : (
              headline
            )}
          </h1>
        </Reveal>
        {subtitle && (
          <Reveal delay={0.2}>
            <p className="font-display font-medium text-base leading-none tracking-normal uppercase text-brand-light/70 mt-20">
              {subtitle}
            </p>
          </Reveal>
        )}
      </div>

      {/* Scroll indicator — bottom center */}
      {showScrollIndicator && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10">
          <ScrollIndicatorButton />
        </div>
      )}

      {/* Social icons — bottom right */}
      {showSocialIcons && socialLinks && (
        <div className="absolute bottom-8 right-8 md:right-12 z-10">
          <SocialLinks links={socialLinks} iconSize={16} />
        </div>
      )}
    </section>
  );
}
