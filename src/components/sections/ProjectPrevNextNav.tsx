import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons/ArrowRight";
import type { OrderedProject } from "@/lib/projects";

type Props = {
  prev: OrderedProject;
  next: OrderedProject;
};

/** Bottom-of-case-study prev/next pager — always active (wrap-around), text
 * + arrow only, reusing the page's existing minimalist link language rather
 * than the numbered "01 HEADING" chapter treatment (this is page chrome /
 * pagination, not case-study narrative content). */
export function ProjectPrevNextNav({ prev, next }: Props) {
  return (
    <section className="pl-6 sm:pl-24 lg:pl-48 pr-6 md:pr-10 lg:pr-24 pb-16 md:pb-24">
      <div className="mx-auto max-w-7xl border-t border-brand-light/10 pt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
        <Link
          href={`/reference/${prev.slug}`}
          className="group inline-flex items-center gap-3 text-left transition-colors"
        >
          <ArrowRightIcon className="h-4 w-8 rotate-180 shrink-0 text-brand-gold transition-transform group-hover:-translate-x-1 group-hover:text-brand-light" />
          <span>
            <span className="block font-body text-sm tracking-widest uppercase text-brand-gold transition-colors group-hover:text-brand-light">
              Předchozí projekt
            </span>
            <span className="block font-display font-bold uppercase text-lg text-brand-light mt-1">
              {prev.title}
            </span>
          </span>
        </Link>

        <Link
          href={`/reference/${next.slug}`}
          className="group inline-flex items-center gap-3 text-right sm:ml-auto transition-colors"
        >
          <span>
            <span className="block font-body text-sm tracking-widest uppercase text-brand-gold transition-colors group-hover:text-brand-light">
              Další projekt
            </span>
            <span className="block font-display font-bold uppercase text-lg text-brand-light mt-1">
              {next.title}
            </span>
          </span>
          <ArrowRightIcon className="h-4 w-8 shrink-0 text-brand-gold transition-transform group-hover:translate-x-1 group-hover:text-brand-light" />
        </Link>
      </div>
    </section>
  );
}
