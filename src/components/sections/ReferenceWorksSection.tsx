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
};

type Project = {
  _id: string;
  title: string;
  client?: string;
  slug: { current: string };
  coverImage?: SanityImage;
  gallery?: SanityImage[];
  excerpt?: string;
  categories?: Category[];
};

type Props = {
  heading?: string;
  description?: string;
  allLabel?: string;
  projects?: Project[];
  categories?: Category[];
};

export function ReferenceWorksSection({
  heading = "REFERENCE",
  description = "Výběr z projektů, které jsme dovedli od prvotní myšlenky až po finální výstup — napříč reklamou, brandingem i firemní komunikací pro klienty, kteří vsadili na naši kreativitu.",
  allLabel = "Vše",
  projects = [],
  categories = [],
}: Props) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();

  const usedCategories = categories.filter((category) =>
    projects.some((project) =>
      project.categories?.some((c) => c._id === category._id),
    ),
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

  return (
    <section className="pl-24 lg:pl-48 pr-6 md:pr-10 lg:pr-24 pt-36 md:pt-44 pb-24">
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

        <Reveal
          delay={0.1}
          className="flex flex-wrap items-center gap-3 mb-10"
        >
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
              <Badge active={activeId === category._id}>
                {category.title}
              </Badge>
            </button>
          ))}
        </Reveal>

        {reduceMotion ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleProjects.map((project, index) => (
              <div key={project._id} className={projectSpanClass(index)}>
                <ProjectCard
                  project={project}
                  aspectClassName={projectAspectClass(index)}
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
      </div>
    </section>
  );
}
