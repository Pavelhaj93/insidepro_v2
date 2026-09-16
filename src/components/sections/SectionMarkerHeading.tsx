import { cn } from "@/lib/utils";

type Props = {
  marker: string;
  heading: string;
  className?: string;
};

/** The "01 / HEADING" numbered-chapter treatment shared by every numbered
 * section on the case-study page (currently 01–04). */
export function SectionMarkerHeading({ marker, heading, className }: Props) {
  return (
    <div className={cn("mb-6", className)}>
      <span className="font-display font-bold text-base leading-8 text-brand-gold">
        {marker}
      </span>
      <h2 className="font-display font-black text-xl md:text-2xl leading-8 tracking-normal uppercase text-brand-light">
        {heading}
      </h2>
    </div>
  );
}
