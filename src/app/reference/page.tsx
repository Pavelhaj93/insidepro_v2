import { groq } from "next-sanity";
import { client } from "@/sanity/lib/client";
import { ReferenceWorksSection } from "@/components/sections/ReferenceWorksSection";

// Same `project`/`category` documents the homepage's reference showcase
// would read from a `referenceWorksSection` block (see `blocksProjection`
// in src/sanity/lib/queries.ts) — pulled directly since no page in this
// dataset has that block configured yet.
const REFERENCE_QUERY = groq`{
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
 * `?category=<slug>` (used by the VerticalSidebar's Branding/Marketing/
 * Produkce/Weby links) preselects that category's filter tab.
 */
export default async function ReferencePage({ searchParams }: Props) {
  const { category } = await searchParams;
  const reference = await client.fetch(REFERENCE_QUERY);

  return (
    <main className="bg-brand-black text-brand-light min-h-screen">
      <ReferenceWorksSection
        {...(reference ?? {})}
        initialCategorySlug={category}
      />
    </main>
  );
}
