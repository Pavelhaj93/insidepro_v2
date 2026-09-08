import { SkeletonText, SkeletonImage } from "@/components/ui/Skeleton";

/**
 * Design POC only — demonstrates a richer case-study narrative rhythm (text,
 * image, text, image) using placeholder content, nested in the left column
 * next to the sticky meta panel in reference/[slug]/page.tsx. Not wired to
 * any CMS field; see the `details` gate there for why this currently
 * renders only for "yachak". Single-column (not side-by-side images) since
 * this column sits at 2/3 width next to the sticky meta panel, too narrow
 * for a legible image pair.
 */
export function CaseStudyExtendedNarrative() {
  return (
    <div className="flex flex-col gap-8 md:gap-10">
      <SkeletonText lines={4} lastLineWidth="w-1/2" />
      <SkeletonImage aspectClassName="aspect-4/3" />
      <SkeletonText lines={3} lastLineWidth="w-1/3" />
      <SkeletonImage aspectClassName="aspect-4/3" />
    </div>
  );
}
