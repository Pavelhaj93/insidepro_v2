import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { groq } from "next-sanity";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { Badge } from "@/components/ui/Badge";
import { CaseStudyPocVariants } from "@/components/sections/casestudy-poc/CaseStudyPocVariants";
import type { PocProject } from "@/components/sections/casestudy-poc/types";

type Props = {
  params: Promise<{ slug: string }>;
};

const PROJECT_QUERY = groq`*[_type == "project" && slug.current == $slug][0]{
  _id, title, client, "slug": slug.current, coverImage, gallery, excerpt,
  "categories": categories[]->title
}`;

/**
 * Design-POC route for an alternate, full-width case-study layout (no sticky
 * meta sidebar) aimed at non-film projects — see plan doc for context.
 * Isolated from the real /reference/[slug] page; safe to remove once a
 * direction is picked.
 */
export default async function CaseStudyPocPage({ params }: Props) {
  const { slug } = await params;
  const project: PocProject | null = await client.fetch(PROJECT_QUERY, { slug });

  if (!project) notFound();

  return (
    <main className="bg-brand-black text-brand-light">
      <section className="relative h-[70vh] min-h-125 w-full overflow-hidden">
        {project.coverImage && (
          <Image
            src={urlFor(project.coverImage).width(1920).url()}
            alt={project.title}
            fill
            sizes="100vw"
            className="object-cover object-center lg:object-[center_30%]"
            priority
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-brand-black via-brand-black/50 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 pl-6 sm:pl-24 lg:pl-48 pr-6 md:pr-10 lg:pr-24 pb-10 md:pb-14">
          <div className="mx-auto max-w-7xl">
            <Link
              href="/reference"
              className="font-body text-sm tracking-widest uppercase text-brand-gold mb-4 inline-flex items-center gap-2 transition-colors hover:text-brand-light"
            >
              ← Reference
            </Link>

            {project.categories && project.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {project.categories.map((category) => (
                  <Badge key={category}>{category}</Badge>
                ))}
              </div>
            )}

            <h1 className="font-display font-black uppercase text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-none text-brand-light">
              {project.title}
            </h1>
          </div>
        </div>
      </section>

      <CaseStudyPocVariants project={project} />
    </main>
  );
}
