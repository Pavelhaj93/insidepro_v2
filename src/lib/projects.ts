import { client } from "@/sanity/lib/client";
import {
  referenceWorksOrderQuery,
  allProjectsOrderQuery,
} from "@/sanity/lib/queries";
import { NON_LINKABLE_SLUGS } from "@/components/sections/ProjectCard";

export type OrderedProject = {
  _id: string;
  _type?: string;
  title: string;
  slug: string;
  hasCaseStudy?: boolean;
};

type ReferenceWorksOrderResult = {
  blocks: { hasCategories: boolean; projects: OrderedProject[] } | null;
} | null;

/**
 * Same ordered project/film list shown on /reference (see
 * src/app/reference/page.tsx), minus image/excerpt/category fields the nav
 * doesn't need. "project" items are filtered by the NON_LINKABLE_SLUGS
 * escape hatch (unchanged); "film" items are filtered by `hasCaseStudy`
 * instead, since films become linkable once their case-study content is
 * filled in rather than via a hardcoded slug list. Mirrors
 * reference/page.tsx's `hasBlockContent` derivation on purpose — keep the
 * two in sync if that cascade ever changes.
 */
export async function getOrderedReferenceProjects(): Promise<OrderedProject[]> {
  const [page, allProjects] = await Promise.all([
    client.fetch<ReferenceWorksOrderResult>(referenceWorksOrderQuery),
    client.fetch<OrderedProject[]>(allProjectsOrderQuery),
  ]);

  const hasBlockContent = Boolean(page?.blocks?.hasCategories);
  const projects = hasBlockContent ? page!.blocks!.projects : allProjects;

  return projects.filter((p) =>
    p._type === "film" ? Boolean(p.hasCaseStudy) : !NON_LINKABLE_SLUGS.has(p.slug),
  );
}

export type AdjacentProjects = { prev: OrderedProject; next: OrderedProject };

/**
 * Wrap-around prev/next: last project's "next" is the first, first
 * project's "prev" is the last. Returns null when the current slug isn't in
 * the list (e.g. a non-linkable project somehow rendered this page) or when
 * fewer than 2 linkable projects exist (nothing to navigate to).
 */
export function getAdjacentProjects(
  projects: OrderedProject[],
  currentSlug: string,
): AdjacentProjects | null {
  const index = projects.findIndex((p) => p.slug === currentSlug);
  if (index === -1 || projects.length < 2) return null;

  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];
  return { prev, next };
}
