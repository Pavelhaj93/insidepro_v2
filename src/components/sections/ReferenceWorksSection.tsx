"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ProjectCard } from "./ProjectCard";
import { Reveal } from "@/components/motion/Reveal";
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
  allLabel?: string;
  allProjects?: Project[];
  allCategories?: Category[];
};

export function ReferenceWorksSection({
  heading = "REFERENCE",
  allLabel = "Vše",
  allProjects = [],
  allCategories = [],
}: Props) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();

  const usedCategories = allCategories.filter((category) =>
    allProjects.some((project) =>
      project.categories?.some((c) => c._id === category._id)
    )
  );

  const visibleProjects = activeId
    ? allProjects.filter((project) =>
        project.categories?.some((c) => c._id === activeId)
      )
    : allProjects;

  const tabClasses = (isActive: boolean) =>
    `font-display font-medium text-[18px] uppercase tracking-wide pb-1 border-b-2 transition-colors ${
      isActive
        ? "text-brand-gold border-brand-gold"
        : "text-brand-light/50 border-transparent hover:text-brand-light"
    }`;

  return (
    <section className="px-8 md:px-0 pt-36 md:pt-44 pb-24 max-w-7xl mx-auto">
      <Reveal>
        <h2 className="font-display font-black text-4xl md:text-6xl lg:text-[75.04px] leading-tight lg:leading-[76.5px] tracking-normal uppercase text-brand-light mb-12">
          {heading}
        </h2>
      </Reveal>

      <Reveal
        delay={0.1}
        className="flex flex-wrap items-center gap-x-8 gap-y-3 mb-12"
      >
        <button
          type="button"
          onClick={() => setActiveId(null)}
          aria-pressed={activeId === null}
          className={tabClasses(activeId === null)}
        >
          {allLabel}
        </button>
        {usedCategories.map((category) => (
          <button
            key={category._id}
            type="button"
            onClick={() => setActiveId(category._id)}
            aria-pressed={activeId === category._id}
            className={tabClasses(activeId === category._id)}
          >
            {category.title}
          </button>
        ))}
      </Reveal>

      {reduceMotion ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {visibleProjects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {visibleProjects.map((project) => (
              <motion.div
                key={project._id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
              >
                <ProjectCard project={project} />
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
    </section>
  );
}
