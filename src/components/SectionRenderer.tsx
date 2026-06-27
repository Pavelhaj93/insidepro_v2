import { HeroSection } from "./sections/HeroSection";
import { ServicesListSection } from "./sections/ServicesListSection";
import { FeaturedWorksSection } from "./sections/FeaturedWorksSection";
import { CtaSection } from "./sections/CtaSection";
import { QuoteSection } from "./sections/QuoteSection";
import { ProcessSection } from "./sections/ProcessSection";
import { TwoColumnSection } from "./sections/TwoColumnSection";
import { TeamSection } from "./sections/TeamSection";
import { FilmShowcaseSection } from "./sections/FilmShowcaseSection";
import { ClientsShowcaseSection } from "./sections/ClientsShowcaseSection";

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
          case "ctaSection":
            return <CtaSection key={block._key} {...block} />;
          case "quoteSection":
            return <QuoteSection key={block._key} {...block} />;
          case "processSection":
            return <ProcessSection key={block._key} {...block} />;
          case "twoColumnSection":
            return <TwoColumnSection key={block._key} {...block} />;
          case "teamSection":
            return <TeamSection key={block._key} {...block} />;
          case "filmShowcaseSection":
            return <FilmShowcaseSection key={block._key} {...block} />;
          case "clientsSection":
            return <ClientsShowcaseSection key={block._key} {...block} />;
          default:
            return null;
        }
      })}
    </>
  );
}
