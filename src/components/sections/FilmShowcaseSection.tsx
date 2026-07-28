import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { Reveal, RevealItem, RevealStagger } from "@/components/motion/Reveal";

type Film = {
  _id: string;
  title: string;
  slug: { current: string };
  coverImage?: { asset: { _ref: string } };
  description?: string;
  director?: string;
  production?: string;
  coproducer?: string;
  partners?: string;
  status?: string;
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
          <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl lg:text-8xl leading-tight tracking-normal uppercase text-brand-light text-center mb-8">
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
        {films.map((film) => (
          <RevealItem key={film._id} className="flex flex-col h-full">
            <div className="relative aspect-2/3 overflow-hidden bg-brand-dark rounded-t-md">
              {film.coverImage && (
                <Image
                  src={urlFor(film.coverImage).width(600).height(900).url()}
                  alt={film.title}
                  fill
                  sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover object-center"
                />
              )}
            </div>

            <div className="bg-brand-grey p-6 flex flex-col flex-1 rounded-b-md">
              <h3 className="font-display font-black text-2xl uppercase text-brand-light min-h-16">
                {film.title}
              </h3>
              <div className="h-px bg-brand-gold-light my-4" />

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
                <span className="font-body text-sm text-brand-light mt-6 pt-6 border-t border-brand-dark/60">
                  {statusLabels[film.status] ?? film.status}
                </span>
              )}
            </div>
          </RevealItem>
        ))}
      </RevealStagger>
    </section>
  );
}
