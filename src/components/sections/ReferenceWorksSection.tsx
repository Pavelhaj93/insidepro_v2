"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ProjectCard } from "./ProjectCard";
import { Reveal } from "@/components/motion/Reveal";
import { Badge } from "@/components/ui/Badge";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { EASE_OUT_EXPO } from "@/lib/motion";

type SanityImage = { asset: { _ref: string } };

type Category = {
  _id: string;
  title: string;
  slug?: string;
  /** Tab order on the Reference page (lower = first) — set in Sanity on the category document. */
  order?: number;
  /** Set only on categories with no projects of their own (e.g. Showreel) — see `activeCategory` below. */
  videoUrl?: string;
};

type Project = {
  _id: string;
  _type?: string;
  title: string;
  client?: string;
  slug: { current: string };
  coverImage?: SanityImage;
  cardImage?: SanityImage;
  excerpt?: string;
  categories?: Category[];
  /** Set on "film" items — drives ProjectCard's linkability instead of the
   * hardcoded NON_LINKABLE_SLUGS list used for "project" items. */
  hasCaseStudy?: boolean;
};

type Props = {
  heading?: string;
  description?: string;
  allLabel?: string;
  projects?: Project[];
  categories?: Category[];
  /** Category slug to preselect on mount, e.g. from `/reference?category=branding`. */
  initialCategorySlug?: string;
};

function PlayIcon() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

export function ReferenceWorksSection({
  heading = "REFERENCE",
  description = "Proměňujeme nápady ve skutečné projekty. Od prvního konceptu přes produkci, branding a marketing až po finální realizaci a dlouhodobou práci se značkou. Děkujeme všem našim klientům za důvěru v nás a naši práci.",
  allLabel = "Vše",
  projects = [],
  categories = [],
  initialCategorySlug,
}: Props) {
  const [activeId, setActiveId] = useState<string | null>(
    () =>
      categories.find((category) => category.slug === initialCategorySlug)
        ?._id ?? null,
  );
  const reduceMotion = useReducedMotion();

  // A category can be "used" either by tagging at least one project, or by
  // carrying its own video (Showreel has no projects at all — its video
  // lives directly on the category document).
  const usedCategories = categories
    .filter(
      (category) =>
        Boolean(category.videoUrl) ||
        projects.some((project) =>
          project.categories?.some((c) => c._id === category._id),
        ),
    )
    .sort((a, b) => {
      // Primary: the `order` field set in Sanity (lower = first); categories
      // without one sort after every ordered category.
      const orderDiff = (a.order ?? Infinity) - (b.order ?? Infinity);
      if (orderDiff !== 0) return orderDiff;

      // Tie-break: video categories (Showreel) sort last among equals —
      // they're a special "extra" tab, not a regular project category.
      return Number(Boolean(a.videoUrl)) - Number(Boolean(b.videoUrl));
    });

  const activeCategory = usedCategories.find(
    (category) => category._id === activeId,
  );

  const visibleProjects = activeId
    ? projects.filter((project) =>
        project.categories?.some((c) => c._id === activeId),
      )
    : projects;

  // 3-column desktop grid, alternating which side is wide: row 0 is
  // left=2/right=1, row 1 flips to left=1/right=2, row 2 back to
  // left=2/right=1, and so on — purely positional, so it re-derives
  // correctly whenever a category filter changes which projects are visible.
  const isProjectWide = (index: number) => {
    const isFirstInPair = index % 2 === 0;
    const rowStartsWide = Math.floor(index / 2) % 2 === 0;
    return isFirstInPair ? rowStartsWide : !rowStartsWide;
  };

  const projectSpanClass = (index: number) =>
    isProjectWide(index) ? "lg:col-span-2" : "lg:col-span-1";

  // The narrow card would otherwise keep its own fixed 4:3 ratio at its
  // (narrower) width and end up visibly shorter than its wide row-mate —
  // at lg it drops the fixed ratio and stretches to match the row's height
  // instead (CSS Grid's default row-stretch, driven by the wide card's own
  // aspect-ratio). Below lg both cards are equal width, so the fixed ratio
  // stays on for a reliably real height regardless of what's next to it.
  const projectAspectClass = (index: number) =>
    isProjectWide(index) ? "aspect-4/3" : "aspect-4/3 lg:aspect-auto lg:h-full";

  // Matches the grid above: 1 column below md, 2 columns md–lg, 3 columns
  // from lg — where a wide card spans 2/3 of the row and a narrow one 1/3 —
  // so the CDN is asked for a resolution matching each card's real width.
  const projectSizes = (index: number) =>
    isProjectWide(index)
      ? "(min-width: 1024px) 66vw, (min-width: 768px) 50vw, 100vw"
      : "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw";

  return (
    <section className="pl-6 sm:pl-24 lg:pl-48 pr-6 md:pr-10 lg:pr-24 pt-36 md:pt-44 pb-24">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="font-body text-sm tracking-widest uppercase text-brand-gold mb-4">
            {`{ Naše práce }`}
          </p>
          <h2 className="font-display font-black uppercase text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-tight text-brand-light mb-4">
            {heading}
          </h2>
          <p className="font-body text-base sm:text-lg leading-7 text-brand-light/70 max-w-2xl mb-10">
            {description}
          </p>
        </Reveal>

        <Reveal delay={0.1} className="flex flex-wrap items-center gap-3 mb-10">
          <button
            type="button"
            onClick={() => setActiveId(null)}
            aria-pressed={activeId === null}
            className="cursor-pointer border-0 bg-transparent p-0"
          >
            <Badge active={activeId === null}>{allLabel}</Badge>
          </button>
          {usedCategories.map((category) => (
            <button
              key={category._id}
              type="button"
              onClick={() => setActiveId(category._id)}
              aria-pressed={activeId === category._id}
              className="cursor-pointer border-0 bg-transparent p-0"
            >
              <Badge
                active={activeId === category._id}
                accent={Boolean(category.videoUrl)}
                className={category.videoUrl ? "gap-1.5" : undefined}
              >
                {category.videoUrl && <PlayIcon />}
                {category.title}
              </Badge>
            </button>
          ))}
        </Reveal>

        {activeCategory?.videoUrl ? (
          // Categories carrying their own video (e.g. Showreel) show that
          // video full-width instead of the project grid — different
          // content entirely, not just a different filter of the same grid.
          <video
            key={activeCategory._id}
            src={activeCategory.videoUrl}
            controls
            className="aspect-video w-full rounded-4xl bg-brand-dark"
          />
        ) : (
          <>
            {reduceMotion ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {visibleProjects.map((project, index) => (
                  <div key={project._id} className={projectSpanClass(index)}>
                    <ProjectCard
                      project={project}
                      aspectClassName={projectAspectClass(index)}
                      sizes={projectSizes(index)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                <AnimatePresence mode="popLayout">
                  {visibleProjects.map((project, index) => (
                    <motion.div
                      key={project._id}
                      layout
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
                      className={projectSpanClass(index)}
                    >
                      <ProjectCard
                        project={project}
                        aspectClassName={projectAspectClass(index)}
                        sizes={projectSizes(index)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}

            {visibleProjects.length === 0 && (
              <p className="font-body text-brand-light/60">
                Žádné projekty v této kategorii.
              </p>
            )}
          </>
        )}
      </div>
    </section>
  );
}
