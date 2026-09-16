import type { PortableTextBlock } from "next-sanity";
import { urlFor } from "@/sanity/lib/image";
import { ScrollIndicatorButton } from "./ScrollIndicatorButton";
import { SocialLinks } from "@/components/layout/SocialLinks";
import { ParallaxBackgroundImage } from "@/components/motion/ParallaxBackgroundImage";
import { HeroBackgroundVideo } from "@/components/motion/HeroBackgroundVideo";
import { PageIntroCurtain } from "@/components/motion/PageIntroCurtain";
import { HeroHeadline } from "./HeroHeadline";
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
    <PageIntroCurtain
      className={`flex flex-col items-center justify-center overflow-hidden ${
        hasVideo
          ? "aspect-9/16 h-auto md:aspect-auto md:h-[calc(100dvh-88px)]"
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

      {/* Content — centered. Headline/subtitle live in a client component
          since their entrance is timed off the curtain's own scroll
          progress (see HeroHeadline/useCurtainProgress) rather than an
          independent in-view reveal, so the curtain's label visibly hands
          off to this text instead of both being on screen together. */}
      <div className="relative z-10 px-8 md:px-12 w-full text-center">
        <HeroHeadline headline={headline} subtitle={subtitle} />
      </div>

      {/* Scroll indicator — bottom center. z-50 (above the curtain's z-40)
          so it stays visible over the closed black panels — the whole
          point of it is to invite the scroll that opens the curtain, so it
          can't be hidden underneath it. */}
      {showScrollIndicator && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50">
          <ScrollIndicatorButton />
        </div>
      )}

      {/* Social icons — bottom right */}
      {showSocialIcons && socialLinks && (
        <div className="absolute bottom-8 right-8 md:right-12 z-10">
          <SocialLinks links={socialLinks} iconSize={24} />
        </div>
      )}
    </PageIntroCurtain>
  );
}
