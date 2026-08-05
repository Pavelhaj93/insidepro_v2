import {
  PortableText,
  type PortableTextBlock,
  type PortableTextComponents,
} from "next-sanity";
import { urlFor } from "@/sanity/lib/image";
import { ScrollIndicatorButton } from "./ScrollIndicatorButton";
import { SocialLinks } from "@/components/layout/SocialLinks";
import { ParallaxBackgroundImage } from "@/components/motion/ParallaxBackgroundImage";
import { HeroBackgroundVideo } from "@/components/motion/HeroBackgroundVideo";
import { Reveal } from "@/components/motion/Reveal";
import { client } from "@/sanity/lib/client";
import { settingsQuery } from "@/sanity/lib/queries";

type Props = {
  backgroundImage?: { asset: { _ref: string } };
  backgroundImageMobile?: { asset: { _ref: string } };
  backgroundVideo?: { asset?: { url?: string; mimeType?: string } };
  backgroundVideoMobile?: { asset?: { url?: string; mimeType?: string } };
  headline?: PortableTextBlock[];
  subtitle?: string;
  showScrollIndicator?: boolean;
  showSocialIcons?: boolean;
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
    gold: ({ children }) => <span className="text-brand-gold">{children}</span>,
    strong: ({ children }) => (
      <strong className="font-extrabold">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
  },
};

export async function HeroSection({
  backgroundImage,
  backgroundImageMobile,
  backgroundVideo,
  backgroundVideoMobile,
  headline,
  subtitle,
  showScrollIndicator = true,
  showSocialIcons = false,
}: Props) {
  const hasVideo = Boolean(backgroundVideo?.asset?.url);

  const socialLinks = showSocialIcons
    ? ((await client.fetch(settingsQuery))?.socialLinks ?? null)
    : null;

  return (
    <section
      className={`relative flex flex-col items-center justify-center overflow-hidden ${
        hasVideo
          ? "aspect-9/16 h-auto mt-22 md:aspect-auto md:h-[calc(100dvh-88px)]"
          : "h-screen"
      }`}
    >
      {/* Background image — always the poster/base layer, loads instantly */}
      {backgroundImage && (
        <ParallaxBackgroundImage
          src={urlFor(backgroundImage).url()}
          mobileSrc={
            backgroundImageMobile
              ? urlFor(backgroundImageMobile).url()
              : undefined
          }
          intensity={12}
          sizes="110vw"
          quality={90}
          priority
        />
      )}

      {/* Background video — plays on top of the image once ready */}
      {backgroundVideo?.asset?.url && (
        <HeroBackgroundVideo
          src={backgroundVideo.asset.url}
          mimeType={backgroundVideo.asset.mimeType}
          mobileSrc={backgroundVideoMobile?.asset?.url}
          mobileMimeType={backgroundVideoMobile?.asset?.mimeType}
        />
      )}

      {backgroundImage || backgroundVideo?.asset?.url ? (
        <div className="absolute inset-0 bg-linear-to-b from-brand-black/40 via-brand-black/20 to-brand-black/70" />
      ) : (
        <div className="absolute inset-0 bg-brand-black" />
      )}

      {/* Content — centered */}
      <div className="relative z-10 px-8 md:px-12 w-full text-center">
        {headline && (
          <Reveal duration={0.9}>
            <h1 className="font-display font-black text-5xl leading-[1.05] sm:text-6xl md:text-7xl lg:text-8xl 2xl:text-9xl tracking-normal uppercase text-brand-light">
              <PortableText value={headline} components={headlineComponents} />
            </h1>
          </Reveal>
        )}
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
          <SocialLinks links={socialLinks} iconSize={24} />
        </div>
      )}
    </section>
  );
}
