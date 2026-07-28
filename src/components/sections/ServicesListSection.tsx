import Link from "next/link";
import { manrope } from "@/lib/fonts";
import { ArrowRightIcon } from "@/components/icons/ArrowRight";

type ServiceItem = {
  number?: string;
  title: string;
  description?: string;
  linkLabel?: string;
  link?: string;
};

type Props = {
  label?: string;
  leftHeading?: string;
  leftHeadingItalic?: string;
  items?: ServiceItem[];
};

export function ServicesListSection({
  label,
  leftHeading,
  leftHeadingItalic,
  items = [],
}: Props) {
  const parts =
    leftHeadingItalic && leftHeading
      ? leftHeading.split(leftHeadingItalic)
      : null;

  return (
    <section className="px-8 xl:px-0 pt-24 pb-12 max-w-7xl mx-auto">
      {label && (
        <p className="font-display font-medium text-base leading-none tracking-normal uppercase text-brand-gold mb-12">
          {label}
        </p>
      )}

      <div
        className={`grid gap-12 md:gap-20 ${leftHeading ? "md:grid-cols-2" : ""}`}
      >
        {/* Left: big heading */}
        {leftHeading && (
          <div>
            <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl lg:text-7xl leading-none tracking-normal uppercase text-brand-light">
              {parts ? (
                <>
                  {parts[0]}
                  <em className="italic text-brand-gold">
                    {leftHeadingItalic}
                  </em>
                  {parts[1]}
                </>
              ) : (
                leftHeading
              )}
            </h2>
          </div>
        )}

        {/* Right: numbered items */}
        <div className="flex flex-col">
          {items.map((item, i) => (
            <div key={i} className="border-t border-brand-gold-light py-12">
              <div className="flex gap-6">
                {item.number && (
                  <span className="font-display font-medium text-base leading-none tracking-normal uppercase text-brand-gold w-8 shrink-0 pt-1">
                    {item.number}
                  </span>
                )}
                <div className="flex-1">
                  <h3 className="font-display font-black text-xl sm:text-2xl md:text-3xl leading-none tracking-normal uppercase text-brand-light mb-4">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p
                      className={`${manrope.className} font-normal text-xl leading-snug tracking-normal text-white whitespace-pre-line`}
                    >
                      {item.description}
                    </p>
                  )}
                  {item.linkLabel && item.link && (
                    <div className="flex justify-end mt-6">
                      <Link
                        href={item.link}
                        className="font-display font-medium text-lg leading-relaxed tracking-normal uppercase text-brand-gold hover:text-brand-light/50 transition-colors flex items-center gap-3"
                      >
                        {item.linkLabel} <ArrowRightIcon />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
