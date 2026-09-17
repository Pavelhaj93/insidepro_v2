import { notFound } from "next/navigation";
import Link from "next/link";
import { groq } from "next-sanity";
import { client } from "@/sanity/lib/client";
import { lqip } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { SanityImage } from "@/components/ui/SanityImage";
import { Badge } from "@/components/ui/Badge";
import { CaseStudyExtendedNarrative } from "@/components/sections/CaseStudyExtendedNarrative";
import { CaseStudyBodySections } from "@/components/sections/CaseStudyBodySections";
import { BehindTheScenesFilmstrip } from "@/components/sections/BehindTheScenesFilmstrip";
import { OutputGalleryMosaic } from "@/components/sections/OutputGalleryMosaic";
import { SectionMarkerHeading } from "@/components/sections/SectionMarkerHeading";
import { GlobeIcon } from "@/components/icons/Globe";
import { parseCaseStudySections } from "@/lib/caseStudyBody";

type Props = {
  params: Promise<{ slug: string }>;
};

type SanityImage = { asset: { _ref: string }; lqip?: string };

type Project = {
  _id: string;
  title: string;
  client?: string;
  websiteUrl?: string;
  slug: string;
  coverImage?: SanityImage;
  gallery?: SanityImage[];
  behindTheScenesGallery?: SanityImage[];
  excerpt?: string;
  categories?: string[];
  // Dereferenced `video` library document (see `project.projectVideo` in the
  // Studio schema) — rendered as a plain <video> player below the synopsis.
  projectVideo?: {
    file?: { asset?: { url?: string; mimeType?: string } };
    poster?: SanityImage;
  };
  // Unstructured Portable Text — see `parseCaseStudySections` for why this
  // isn't typed any more precisely than "blocks with span children".
  body?: { _type: string; children?: { _type: "span"; text?: string; marks?: string[] }[] }[];
};

const PROJECT_QUERY = groq`*[_type == "project" && slug.current == $slug][0]{
  _id, title, client, websiteUrl, "slug": slug.current,
  coverImage { ${lqip} }, gallery[] { ${lqip} }, behindTheScenesGallery[] { ${lqip} },
  excerpt, body,
  "categories": categories[]->title,
  projectVideo-> { file { asset->{ url, mimeType } }, poster }
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
      { label: "Rok", value: "2025 / 2026" },
      { label: "Režie", value: "Jan Rajnoha" },
      { label: "Země", value: "Česká republika, Ekvádor, USA" },
      { label: "Žánr", value: "Celovečerní dokumentární film" },
      { label: "Produkce", value: "Analog Vision s.r.o." },
      { label: "Koproducent", value: "insidePRO" },
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
  const bodySections = parseCaseStudySections(project.body);
  const leftoverGallery =
    bodySections.length > 0
      ? (project.gallery ?? []).slice(bodySections.length)
      : (project.gallery ?? []);

  return (
    <main className="bg-brand-black text-brand-light">
      <section className="relative h-[70vh] min-h-125 w-full overflow-hidden">
        {project.coverImage && (
          <SanityImage
            src={urlFor(project.coverImage).url()}
            alt={project.title}
            sizes="100vw"
            className="object-cover object-center lg:object-[center_30%]"
            priority
            blurDataURL={project.coverImage.lqip}
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-brand-black via-brand-black/50 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 pl-6 sm:pl-24 lg:pl-48 pr-6 md:pr-10 lg:pr-24 pb-10 md:pb-14">
          <div className="mx-auto max-w-7xl flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="max-w-3xl">
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

              {(details?.synopsis ?? project.excerpt) && (
                <p className="font-body text-lg sm:text-xl leading-8 text-brand-light/80 mt-4 max-w-2xl">
                  {details?.synopsis ?? project.excerpt}
                </p>
              )}
            </div>

            {project.websiteUrl && (
              <a
                href={project.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center gap-2 font-display font-medium text-sm sm:text-base uppercase tracking-wide text-brand-gold hover:text-brand-light transition-colors"
              >
                <GlobeIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                Navštívit web
              </a>
            )}
          </div>
        </div>
      </section>

      {details && (
        <section className="pl-6 sm:pl-24 lg:pl-48 pr-6 md:pr-10 lg:pr-24 py-16 md:py-24">
          <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-12 items-start">
            <div className="flex flex-col gap-12 md:gap-16 max-w-2xl">
              <CaseStudyExtendedNarrative />
            </div>

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
          </div>
        </section>
      )}

      {bodySections.length > 0 && (
        <CaseStudyBodySections
          sections={bodySections}
          gallery={project.gallery}
          title={project.title}
        />
      )}

      <BehindTheScenesFilmstrip
        images={project.behindTheScenesGallery}
        title={project.title}
      />

      {project.projectVideo?.file?.asset?.url && (
        <section className="pl-6 sm:pl-24 lg:pl-48 pr-6 md:pr-10 lg:pr-24 pb-16 md:pb-24">
          <div className="mx-auto max-w-7xl">
            <SectionMarkerHeading marker="04" heading="Výsledek" />
            <video
              src={project.projectVideo.file.asset.url}
              poster={
                project.projectVideo.poster
                  ? urlFor(project.projectVideo.poster).width(1920).url()
                  : undefined
              }
              controls
              playsInline
              className="aspect-video w-full rounded-4xl bg-brand-dark"
            />
          </div>
        </section>
      )}

      <OutputGalleryMosaic
        images={leftoverGallery}
        title={project.title}
        startIndex={bodySections.length}
      />
    </main>
  );
}
