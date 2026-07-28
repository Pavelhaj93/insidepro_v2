"use client";

import { useState } from "react";
import { ProjectCard } from "./ProjectCard";

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
    <section className="px-8 md:px-0 py-24 max-w-7xl mx-auto">
      <h2 className="font-display font-black text-4xl md:text-6xl lg:text-[75.04px] leading-tight lg:leading-[76.5px] tracking-normal uppercase text-brand-light mb-12">
        {heading}
      </h2>

      <div className="flex flex-wrap items-center gap-x-8 gap-y-3 mb-12">
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {visibleProjects.map((project) => (
          <ProjectCard key={project._id} project={project} />
        ))}
      </div>

      {visibleProjects.length === 0 && (
        <p className="font-body text-brand-light/60">
          Žádné projekty v této kategorii.
        </p>
      )}
    </section>
  );
}
