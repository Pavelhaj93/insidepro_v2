import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import { SanityImage } from "@/components/ui/SanityImage";
import { Reveal, RevealItem, RevealStagger } from "@/components/motion/Reveal";

type Film = {
  _id: string;
  title: string;
  slug: { current: string };
  coverImage?: { asset: { _ref: string }; lqip?: string };
  description?: string;
  director?: string;
  production?: string;
  coproducer?: string;
  partners?: string;
  status?: string;
  /** Set only when this film has a matching case-study project linked in
   * Studio (`film.relatedProject`) — the card links to `/reference/{slug}`
   * when present, and isn't clickable otherwise. */
  relatedProjectSlug?: string;
};

const statusLabels: Record<string, string> = {
  "in-development": "In Development",
  "in-production": "In Production",
  "in-post-production": "In Post-Production",
  finishing: "Finishing",
  released: "Released",
};

type Props = {
  label?: string;
  heading?: string;
  introText?: string;
  films?: Film[];
};

type MetaKey = "director" | "production" | "coproducer" | "partners";

const metaFields: Array<{ key: MetaKey; label: string }> = [
  { key: "director", label: "Režie" },
  { key: "production", label: "Produkce" },
  { key: "coproducer", label: "Koproducent" },
  { key: "partners", label: "Partneři projektu" },
];

export function FilmShowcaseSection({
  label,
  heading,
  introText,
  films = [],
}: Props) {
  return (
    <section className="px-8 xl:px-0 py-24 max-w-7xl mx-auto">
      <Reveal>
        {label && (
          <p className="font-body text-xs tracking-widest text-brand-light/40 uppercase mb-4 text-center">
            {label}
          </p>
        )}
        {heading && (
          <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-none tracking-normal uppercase text-brand-light text-center mb-12">
            {heading}
          </h2>
        )}
        {introText && (
          <p className="font-body text-sm text-brand-light/60 leading-relaxed max-w-2xl mx-auto text-center mb-14">
            {introText}
          </p>
        )}
      </Reveal>

      <RevealStagger className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {films.map((film) => {
          const cardContent = (
            <>
              <div className="relative aspect-4/5 overflow-hidden bg-brand-dark rounded-t-md">
                {film.coverImage && (
                  <SanityImage
                    src={urlFor(film.coverImage).url()}
                    alt={film.title}
                    sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover object-center grayscale transition-all duration-700 ease-out group-hover:grayscale-0 motion-safe:group-hover:scale-105"
                    blurDataURL={film.coverImage.lqip}
                  />
                )}
              </div>

              <div className="bg-brand-grey p-5 flex flex-col flex-1 rounded-b-md">
                <h3 className="font-display font-black text-3xl uppercase text-brand-light leading-9 h-18 line-clamp-2">
                  {film.title}
                </h3>
                <div className="h-px bg-brand-gold-light my-3" />

                <div className="font-body text-sm text-brand-gold leading-relaxed space-y-1 flex-1">
                  {metaFields.map(
                    ({ key, label: metaLabel }) =>
                      film[key] && (
                        <p key={key}>
                          {metaLabel}:{" "}
                          <span className="font-bold">{film[key]}</span>
                        </p>
                      ),
                  )}
                </div>

                {film.status && (
                  <span className="font-body text-sm text-brand-light mt-4 pt-4 border-t border-brand-dark/60">
                    {statusLabels[film.status] ?? film.status}
                  </span>
                )}
              </div>
            </>
          );

          return (
            <RevealItem key={film._id} className="h-full">
              {film.relatedProjectSlug ? (
                <Link
                  href={`/reference/${film.relatedProjectSlug}`}
                  className="group flex h-full flex-col"
                >
                  {cardContent}
                </Link>
              ) : (
                <div className="group flex h-full flex-col">{cardContent}</div>
              )}
            </RevealItem>
          );
        })}
      </RevealStagger>
    </section>
  );
}
