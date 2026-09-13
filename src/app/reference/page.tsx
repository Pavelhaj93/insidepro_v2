import { groq } from "next-sanity";
import { client } from "@/sanity/lib/client";
import { referencePageQuery } from "@/sanity/lib/queries";
import { ReferenceWorksSection } from "@/components/sections/ReferenceWorksSection";

// Fallback used only when there's no `page` document with slug "reference"
// yet (or it has no Reference Works Section block configured) — shows every
// category/project so the route never renders empty before Studio is set up.
const FALLBACK_QUERY = groq`{
  "categories": *[_type == "category"] { _id, title, "slug": slug.current, order, "videoUrl": video.asset->url },
  "projects": *[_type == "project"] | order(publishedAt desc) {
    _id, title, client, slug, coverImage, gallery, excerpt,
    "categories": categories[]-> { _id, title, "slug": slug.current }
  }
}`;

type Props = {
  searchParams: Promise<{ category?: string }>;
};

/**
 * Showcase reference/works page — the `VerticalSidebar` nav comes from the
 * root layout now (there's no global Header on this showcase), so this page
 * only needs the real `ReferenceWorksSection` content underneath it.
 *
 * Its heading/categories/curated project list come from the `page` document
 * whose slug is "reference" in Studio, specifically its "Reference Works
 * Section" block — the same schema/component the generic page-builder uses
 * (see `blocksProjection` in src/sanity/lib/queries.ts), just read directly
 * here since this route is its own static page rather than the generic
 * `[slug]` pipeline. Falls back to every category/project when no such page
 * exists yet, so the route is never empty out of the box.
 *
 * `?category=<slug>` (used by the VerticalSidebar's Branding/Marketing/
 * Produkce/Weby links) preselects that category's filter tab.
 */
export default async function ReferencePage({ searchParams }: Props) {
  const { category } = await searchParams;
  const [page, fallback] = await Promise.all([
    client.fetch(referencePageQuery),
    client.fetch(FALLBACK_QUERY),
  ]);

  const block = page?.blocks?.find(
    (b: { _type: string }) => b._type === "referenceWorksSection",
  );
  const hasBlockContent = Boolean(block?.categories?.length);

  return (
    <main className="bg-brand-black text-brand-light min-h-screen">
      <ReferenceWorksSection
        heading={block?.heading}
        allLabel={block?.allLabel}
        categories={hasBlockContent ? block.categories : fallback?.categories}
        projects={hasBlockContent ? block.projects : fallback?.projects}
        initialCategorySlug={category}
      />
    </main>
  );
}
