type Align = "center" | "left" | "right";

const WRAPPER_CLASS: Record<Align, string> = {
  center: "mx-auto max-w-2xl text-center",
  left: "mr-auto max-w-md text-left",
  right: "ml-auto max-w-md text-right",
};

const ROW_JUSTIFY: Record<Align, string> = {
  center: "justify-center",
  left: "justify-start",
  right: "justify-end",
};

/**
 * Numbered section heading + paragraph — reuses the site's existing
 * "01 + title" language (see ProcessSection / ServicesListSection) instead
 * of a bare centered paragraph, so the case-study narrative reads as one
 * more section type on the site rather than a generic text block.
 */
export function PocTextBlock({
  number,
  title,
  text,
  align = "center",
}: {
  number: string;
  title: string;
  text: string;
  align?: Align;
}) {
  return (
    <div className={`border-t border-brand-gold-light pt-8 ${WRAPPER_CLASS[align]}`}>
      <div className={`flex items-baseline gap-3 mb-4 ${ROW_JUSTIFY[align]}`}>
        <span className="font-display font-medium text-base uppercase tracking-widest text-brand-gold">
          {number}
        </span>
        <h3 className="font-display font-black text-xl sm:text-2xl uppercase text-brand-light">
          {title}
        </h3>
      </div>
      <p className="font-body text-lg leading-8 text-brand-light/80 sm:text-xl">
        {text}
      </p>
    </div>
  );
}
