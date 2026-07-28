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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function SectionRenderer({ blocks }: { blocks: any[] }) {
  if (!blocks?.length) return null;

  return (
    <>
      {blocks.map((block) => {
        switch (block._type) {
          case "heroSection":
            return <HeroSection key={block._key} {...block} />;
          case "servicesListSection":
            return <ServicesListSection key={block._key} {...block} />;
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
            return <TeamSection key={block._key} {...block} />;
          case "filmShowcaseSection":
            return <FilmShowcaseSection key={block._key} {...block} />;
          case "clientsSection":
            return <ClientsShowcaseSection key={block._key} {...block} />;
          case "imageSection":
            return <ImageSection key={block._key} {...block} />;
          case "infoBoxSection":
            return <InfoBoxSection key={block._key} {...block} />;
          case "featureCardsSection":
            return <FeatureCardsSection key={block._key} {...block} />;
          case "richTextSection":
            return <RichTextSection key={block._key} {...block} />;
          case "logoWallSection":
            return <LogoWallSection key={block._key} {...block} />;
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
