import { HeroSection } from "./sections/HeroSection";
import { ServicesListSection } from "./sections/ServicesListSection";
import { FeaturedWorksSection } from "./sections/FeaturedWorksSection";
import { ReferenceWorksSection } from "./sections/ReferenceWorksSection";
import { CtaSection } from "./sections/CtaSection";
import { QuoteSection } from "./sections/QuoteSection";
import { ProcessSection } from "./sections/ProcessSection";
import { TeamSection } from "./sections/TeamSection";
import { FilmShowcaseSection } from "./sections/FilmShowcaseSection";
import { ClientsShowcaseSection } from "./sections/ClientsShowcaseSection";
import { ImageSection } from "./sections/ImageSection";
import { InfoBoxSection } from "./sections/InfoBoxSection";
import { FeatureCardsSection } from "./sections/FeatureCardsSection";
import { RichTextSection } from "./sections/RichTextSection";
import { LogoWallSection } from "./sections/LogoWallSection";
import { TextBlockSection } from "./sections/TextBlockSection";
import { Separator } from "./sections/Separator";
import { SplitVideoReveal } from "@/components/motion/SplitVideoReveal";
import { ZoomTextTransition } from "@/components/motion/ZoomTextTransition";
import { ServicesAccordionScroll } from "@/components/home/ServicesAccordionScroll";
import { WhoWeAreSection } from "@/components/home/WhoWeAreSection";
import { ClientShowcaseHorizontal } from "@/components/home/ClientShowcaseHorizontal";
import { LogoCarousel } from "@/components/home/LogoCarousel";
import { TeamShowcaseSection } from "@/components/home/TeamShowcaseSection";

type SectionRendererProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  blocks: any[];
  settings?: { logo?: { asset: { _ref: string } } | null } | null;
};

export function SectionRenderer({ blocks, settings }: SectionRendererProps) {
  if (!blocks?.length) return null;

  return (
    <>
      {blocks.map((block) => {
        switch (block._type) {
          case "heroSection":
            return <HeroSection key={block._key} {...block} />;
          case "splitVideoRevealSection":
            return (
              <SplitVideoReveal
                key={block._key}
                kicker={block.kicker}
                headline={block.headline}
                subtitle={block.subtitle}
                cornerHeadline={block.cornerHeadline}
                videoSrc={block.video?.asset?.url}
                videoMimeType={block.video?.asset?.mimeType}
                mobileVideoSrc={block.mobileVideo?.asset?.url}
              />
            );
          case "servicesListSection":
            return <ServicesListSection key={block._key} {...block} />;
          case "servicesAccordionSection":
            return (
              <ServicesAccordionScroll
                key={block._key}
                label={block.label}
                heading={block.heading}
                items={block.items}
              />
            );
          case "whoWeAreSection":
            return (
              <WhoWeAreSection
                key={block._key}
                logo={settings?.logo ?? null}
                eyebrow={block.eyebrow}
                heading={block.heading}
                missionText={block.missionText}
                leftPhotos={block.leftPhotos}
                rightImage={block.rightImage}
                badgeText={block.badgeText}
              />
            );
          case "zoomTextSection":
            return (
              <ZoomTextTransition
                key={block._key}
                label={block.label}
                headline={block.headline}
                accentColor={block.accentColor}
                anchorIndex={block.anchorIndex}
              />
            );
          case "featuredWorksSection":
            return <FeaturedWorksSection key={block._key} {...block} />;
          case "referenceWorksSection":
            return <ReferenceWorksSection key={block._key} {...block} />;
          case "ctaSection":
            return <CtaSection key={block._key} {...block} />;
          case "quoteSection":
            return <QuoteSection key={block._key} {...block} />;
          case "processSection":
            return <ProcessSection key={block._key} {...block} />;
          case "teamSection":
            return block.lightBackground ? (
              <TeamShowcaseSection
                key={block._key}
                eyebrow={block.eyebrow}
                heading={block.heading}
                teamMembers={block.teamMembers}
                outroText={block.outroText}
                outroHighlight={block.outroHighlight}
                ctaLabel={block.ctaLabel}
                ctaLink={block.ctaLink}
                invert
              />
            ) : (
              <TeamSection key={block._key} {...block} />
            );
          case "filmShowcaseSection":
            return <FilmShowcaseSection key={block._key} {...block} />;
          case "clientsSection":
            return block.layout === "horizontalScroll" ? (
              <ClientShowcaseHorizontal
                key={block._key}
                label={block.label}
                clients={block.clients}
              />
            ) : (
              <ClientsShowcaseSection key={block._key} {...block} />
            );
          case "imageSection":
            return <ImageSection key={block._key} {...block} />;
          case "infoBoxSection":
            return <InfoBoxSection key={block._key} {...block} />;
          case "featureCardsSection":
            return <FeatureCardsSection key={block._key} {...block} />;
          case "richTextSection":
            return <RichTextSection key={block._key} {...block} />;
          case "logoWallSection":
            return block.layout === "marquee" ? (
              <LogoCarousel
                key={block._key}
                topRowLogos={block.topRowLogos}
                bottomRowLogos={block.bottomRowLogos}
              />
            ) : (
              <LogoWallSection
                key={block._key}
                title={block.title}
                logos={[...(block.topRowLogos ?? []), ...(block.bottomRowLogos ?? [])]}
              />
            );
          case "textBlock":
            return <TextBlockSection key={block._key} {...block} />;
          case "separator":
            return <Separator key={block._key} {...block} />;
          default:
            return null;
        }
      })}
    </>
  );
}
