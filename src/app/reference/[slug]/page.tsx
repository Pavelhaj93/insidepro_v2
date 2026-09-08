import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { groq } from "next-sanity";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { Badge } from "@/components/ui/Badge";
import { CaseStudyExtendedNarrative } from "@/components/sections/CaseStudyExtendedNarrative";

type Props = {
  params: Promise<{ slug: string }>;
};

type SanityImage = { asset: { _ref: string } };

type Project = {
  _id: string;
  title: string;
  client?: string;
  slug: string;
  coverImage?: SanityImage;
  gallery?: SanityImage[];
  excerpt?: string;
  categories?: string[];
};

const PROJECT_QUERY = groq`*[_type == "project" && slug.current == $slug][0]{
  _id, title, client, "slug": slug.current, coverImage, gallery, excerpt,
  "categories": categories[]->title
}`;

// Rich case-study metadata hardcoded for this POC, keyed by slug — the real
// `project` schema (studio/src/schemaTypes/documents/project.ts) has no
// fields yet for year, industry, timeline, crew, or partners. Every other
// project still gets a real page here, just with only the Sanity fields it
// actually has (title/client/cover/excerpt), no synopsis or meta grid.
const CASE_STUDY_DETAILS: Record<
  string,
  {
    synopsis: string;
    meta: { label: string; value: string }[];
    partners: string[];
  }
> = {
  yachak: {
    synopsis:
      "Agustin is a young shaman from the jungle, living at the edge of two worlds, who is trying to save the remnants of his declining culture. But his home is being plundered relentlessly. Will he manage to find balance between the two worlds in time? Is salvation even possible?",
    meta: [
      { label: "Rok", value: "2025" },
      { label: "Klient", value: "Analog Vision" },
      { label: "Odvětví", value: "Environmental" },
      { label: "Doba zpracování", value: "5 weeks" },
      { label: "Režie", value: "Jan Rajnoha" },
      { label: "Produkce", value: "Analog Vision s.r.o." },
      { label: "Koproducent", value: "insideFILMS" },
    ],
    partners: [
      "Mendelova univerzita v Brně",
      "United Nations (OSN)",
      "Sigma",
      "Sony",
      "Dron Pro",
      "Život postaru z.s.",
    ],
  },
};

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const project: Project | null = await client.fetch(PROJECT_QUERY, { slug });

  if (!project) notFound();

  const details = CASE_STUDY_DETAILS[slug];

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

        <div className="absolute bottom-0 left-0 right-0 pl-24 lg:pl-48 pr-6 md:pr-10 lg:pr-24 pb-10 md:pb-14">
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

      <section className="pl-24 lg:pl-48 pr-6 md:pr-10 lg:pr-24 py-16 md:py-24">
        <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-12 items-start">
          <div className="flex flex-col gap-12 md:gap-16 max-w-2xl">
            <p className="font-body text-lg sm:text-xl leading-8 text-brand-light/80">
              {details?.synopsis ?? project.excerpt}
            </p>

            {/* Gated on the same hardcoded `details` lookup as the meta panel
                to the right (design POC, yachak only). Swap for a real
                per-project CMS field once actual case-study content exists
                to replace these placeholders. */}
            {details && <CaseStudyExtendedNarrative />}
          </div>

          {details && (
            <div className="flex flex-col gap-6 lg:sticky lg:top-32">
              <dl className="grid grid-cols-2 gap-x-6 gap-y-6">
                {details.meta.map((item) => (
                  <div key={item.label}>
                    <dt className="font-body text-xs tracking-widest uppercase text-brand-gold mb-1">
                      {item.label}
                    </dt>
                    <dd className="font-display font-bold text-brand-light">
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>

              {details.partners.length > 0 && (
                <div>
                  <p className="font-body text-xs tracking-widest uppercase text-brand-gold mb-2">
                    Partneři projektu
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {details.partners.map((partner) => (
                      <Badge key={partner}>{partner}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {project.gallery && project.gallery.length > 0 && (
        <section className="pl-24 lg:pl-48 pr-6 md:pr-10 lg:pr-24 pb-24">
          <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-6">
            {project.gallery.map((image, index) => (
              <div
                key={index}
                className="relative aspect-4/3 overflow-hidden rounded-4xl bg-brand-dark"
              >
                <Image
                  src={urlFor(image).width(1200).height(900).url()}
                  alt={`${project.title} — ${index + 1}`}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover object-center"
                />
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
