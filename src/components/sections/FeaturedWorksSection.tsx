import Link from "next/link";
import { ProjectCard } from "./ProjectCard";
import { ArrowRightIcon } from "@/components/icons/ArrowRight";
import { Reveal, RevealItem, RevealStagger } from "@/components/motion/Reveal";

type Project = {
  _id: string;
  title: string;
  client?: string;
  slug: { current: string };
  coverImage?: { asset: { _ref: string } };
  gallery?: { asset: { _ref: string } }[];
  category?: string;
  excerpt?: string;
};

type Props = {
  heading?: string;
  showViewAllLink?: boolean;
  viewAllLabel?: string;
  viewAllSlug?: string;
  projects?: Project[];
};

export function FeaturedWorksSection({
  heading = "VYBRANÉ PRÁCE",
  showViewAllLink = true,
  viewAllLabel = "ZOBRAZIT VŠE",
  viewAllSlug = "/prace",
  projects = [],
}: Props) {
  return (
    <section className="px-8 xl:px-0 py-24 max-w-7xl mx-auto">
      <Reveal className="flex items-end justify-between mb-12">
        <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl lg:text-7xl leading-tight tracking-normal uppercase text-brand-light">
          {heading}
        </h2>
        {showViewAllLink && (
          <Link
            href={viewAllSlug}
            className="font-display font-medium text-lg text-brand-gold leading-relaxed tracking-normal uppercase hover:text-brand-light/50 transition-colors flex items-center gap-2"
          >
            {viewAllLabel} <ArrowRightIcon />
          </Link>
        )}
      </Reveal>

      <RevealStagger className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <RevealItem key={project._id}>
            <ProjectCard project={project} />
          </RevealItem>
        ))}
      </RevealStagger>

      {projects.length === 0 && (
        <p className="font-body text-sm text-brand-light/30 text-center py-12">
          No projects added yet.
        </p>
      )}
    </section>
  );
}
