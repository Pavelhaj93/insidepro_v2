import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { Reveal } from "@/components/motion/Reveal";
import { SectionMarkerHeading } from "@/components/sections/SectionMarkerHeading";
import type { CaseStudySection } from "@/lib/caseStudyBody";

type SanityImage = { asset: { _ref: string } };

type Props = {
  sections: CaseStudySection[];
  gallery?: SanityImage[];
  title: string;
};

/**
 * Renders the "01 / heading / paragraph, 02 / heading / paragraph" content
 * parsed out of `project.body` (see `parseCaseStudyBody`) as alternating
 * text/photo rows — each section paired with one gallery image, zigzagging
 * which side the photo sits on.
 */
export function CaseStudyBodySections({ sections, gallery = [], title }: Props) {
  return (
    <section className="pl-6 sm:pl-24 lg:pl-48 pr-6 md:pr-10 lg:pr-24 pb-16 md:pb-24">
      <div className="mx-auto max-w-7xl flex flex-col gap-16 md:gap-24">
        {sections.map((section, index) => {
          const image = gallery[index];
          const imageOnRight = index % 2 === 0;

          return (
            <Reveal key={section.marker} delay={index * 0.1}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                <div className={imageOnRight ? "lg:order-1" : "lg:order-2"}>
                  <SectionMarkerHeading marker={section.marker} heading={section.heading} />
                  <div className="flex flex-col gap-6">
                    {section.paragraphs.map((paragraph, pIndex) => (
                      <p
                        key={pIndex}
                        className="font-body text-lg leading-relaxed text-brand-light/80"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                  {section.credit && (
                    <p className="font-body text-sm text-brand-light/50 mt-6">
                      {section.credit}
                    </p>
                  )}
                </div>

                {image && (
                  <div
                    className={`relative aspect-4/3 overflow-hidden rounded-4xl bg-brand-dark ${
                      imageOnRight ? "lg:order-2" : "lg:order-1"
                    }`}
                  >
                    <Image
                      src={urlFor(image).width(1200).height(900).url()}
                      alt={`${title} — ${section.marker}`}
                      fill
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      className="object-cover object-center"
                    />
                  </div>
                )}
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
