import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { ScrollIndicatorButton } from "./ScrollIndicatorButton";
import { SocialLinks } from "@/components/layout/SocialLinks";
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
          <Image
            src={urlFor(backgroundImage).width(1920).height(1080).url()}
            alt=""
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-black/40 via-brand-black/20 to-brand-black/70" />
        </>
      )}
      {!backgroundImage && <div className="absolute inset-0 bg-brand-black" />}

      {/* Content — centered */}
      <div className="relative z-10 px-8 md:px-12 w-full text-center">
        <h1 className="font-display font-black text-[127.34px] leading-[124.76px] tracking-normal uppercase text-brand-light">
          {headlineItalic && parts[0] !== undefined ? (
            <>
              {parts[0]}
              <em className="not-italic italic">{headlineItalic}</em>
              {parts[1]}
            </>
          ) : (
            headline
          )}
        </h1>
        {subtitle && (
          <p className="font-display font-medium text-[16.87px] leading-[16.53px] tracking-normal uppercase text-brand-light/70 mt-6">
            {subtitle}
          </p>
        )}
      </div>

      {/* Scroll indicator — bottom center */}
      {showScrollIndicator && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
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
