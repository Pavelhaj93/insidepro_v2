import type { Metadata } from "next";
import { groq } from "next-sanity";
import type { ComponentProps } from "react";
import { fetchSanity } from "@/sanity/lib/live";
import { referencePageQuery, referenceItemFields } from "@/sanity/lib/queries";
import { ReferenceWorksSection } from "@/components/sections/ReferenceWorksSection";

// Fallback used only when there's no `page` document with slug "reference"
// yet (or it has no Reference Works Section block configured) — shows every
// category/project/film so the route never renders empty before Studio is
// set up. Mirrors blocksProjection's referenceWorksSection branch in
// src/sanity/lib/queries.ts exactly (keep both in sync).
const FALLBACK_QUERY = groq`{
  "categories": *[_type == "category"] { _id, title, "slug": slug.current, order, "videoPlaybackId": featuredVideo->muxVideo.asset->playbackId, "videoThumbTime": featuredVideo->muxVideo.asset->thumbTime, "videoPoster": featuredVideo->poster.asset->url },
  "projects": *[_type in ["project", "film"]] | order(publishedAt desc) {
    ${referenceItemFields}
  }
}`;

type WorksProps = ComponentProps<typeof ReferenceWorksSection>;
type WorksBlock = { _type: string } & Pick<WorksProps, "heading" | "allLabel" | "categories" | "projects">;
type ReferencePageData = {
  seoTitle?: string;
  seoDescription?: string;
  blocks?: WorksBlock[];
} | null;

export async function generateMetadata(): Promise<Metadata> {
  const page = await fetchSanity<ReferencePageData>({ query: referencePageQuery, stega: false });
  return {
    title: page?.seoTitle ?? "Reference | insidePRO",
    description: page?.seoDescription ?? undefined,
  };
}

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
 * Deliberately doesn't read `searchParams`: that alone would make the route
 * dynamic (no CDN cache). The category filter is client-side state only.
 */
export default async function ReferencePage() {
  const [page, fallback] = await Promise.all([
    fetchSanity<ReferencePageData>({ query: referencePageQuery }),
    fetchSanity<Pick<WorksProps, "categories" | "projects"> | null>({ query: FALLBACK_QUERY }),
  ]);

  const block = page?.blocks?.find((b) => b._type === "referenceWorksSection");
  const hasBlockContent = Boolean(block?.categories?.length);

  return (
    <main className="bg-brand-black text-brand-light min-h-screen">
      <ReferenceWorksSection
        heading={block?.heading}
        allLabel={block?.allLabel}
        categories={hasBlockContent ? block?.categories : fallback?.categories}
        projects={hasBlockContent ? block?.projects : fallback?.projects}
      />
    </main>
  );
}
