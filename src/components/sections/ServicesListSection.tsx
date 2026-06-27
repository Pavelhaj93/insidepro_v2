import { manrope } from "@/lib/fonts";

type ServiceItem = {
  number?: string;
  title: string;
  description?: string;
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
    <section className="px-8 md:px-12 py-24 max-w-screen-xl mx-auto">
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
            <h2 className="font-display font-black text-7xl leading-none tracking-normal uppercase text-brand-light">
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
            <div key={i} className="border-t border-brand-dark/60 py-8">
              <div className="flex gap-6">
                {item.number && (
                  <span className="font-display font-medium text-base leading-none tracking-normal uppercase text-brand-gold w-8 shrink-0 pt-1">
                    {item.number}
                  </span>
                )}
                <div>
                  <h3 className="font-display font-black text-3xl leading-none tracking-normal uppercase text-brand-light mb-4">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p
                      className={`${manrope.className} font-extrabold text-xl leading-snug tracking-normal text-brand-light/70`}
                    >
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
          {items.length > 0 && (
            <div className="border-t border-brand-dark/60" />
          )}
        </div>
      </div>
    </section>
  );
}
