import { POC_COPY } from "./pocContent";
import type { PocProject } from "./types";
import { getPocImages } from "./utils";
import { PocFullBleedImage } from "./PocFullBleedImage";
import { PocTextBlock } from "./PocTextBlock";
import { PocVideo } from "./PocVideo";

/**
 * Variant A — editorial alternation: text, image, text, image, text, image,
 * video. Narrower text column inside a wider container so images read as
 * bigger than the copy either side of them.
 */
export function VariantAEditorial({ project }: { project: PocProject }) {
  const images = getPocImages(project);
  const [zadani, spoluprace, vysledek] = POC_COPY.sections;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-16 px-6 py-16 md:gap-20 md:py-24">
      <PocTextBlock {...zadani} />

      <PocFullBleedImage image={images[0]} alt={`${project.title} — 1`} />

      <PocTextBlock {...spoluprace} />

      <PocFullBleedImage image={images[1]} alt={`${project.title} — 2`} />

      <PocTextBlock {...vysledek} />

      <PocFullBleedImage image={images[2]} alt={`${project.title} — 3`} />

      <PocVideo />
    </div>
  );
}
