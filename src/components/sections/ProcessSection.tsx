import { manrope } from "@/lib/fonts";
import { Reveal, RevealItem, RevealStagger } from "@/components/motion/Reveal";

type ProcessStep = {
  number?: string;
  title: string;
  description?: string;
  descriptionHighlight?: string;
};

type Props = {
  label?: string;
  steps?: ProcessStep[];
};

export function ProcessSection({ label, steps = [] }: Props) {
  return (
    <section className="px-8 xl:px-0 pt-24 bg-black">
      <div className="max-w-7xl mx-auto pb-24">
        {label && (
          <Reveal>
            <p className="font-body text-lg text-brand-gold tracking-widest  uppercase mb-12 font-medium">
              {label}
            </p>
          </Reveal>
        )}

        <RevealStagger className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <RevealItem
              key={i}
              className="group border border-brand-dark/60 p-6 bg-brand-grey rounded-md"
            >
              {step.number && (
                <span className="font-display font-bold text-4xl sm:text-5xl lg:text-7xl text-brand-gold-light block mb-20 transition-colors duration-300 group-hover:text-brand-gold">
                  {step.number}
                </span>
              )}
              <h3 className="relative font-display font-black leading-8 text-2xl uppercase text-brand-light mb-3 pb-8">
                {step.title}
                <span className="absolute bottom-0 left-0 h-px w-full bg-brand-gold-light origin-left scale-x-100 transition-transform duration-500 group-hover:scale-x-75 group-hover:bg-brand-gold" />
              </h3>
              {step.description && (
                <p
                  className={`${manrope.className} font-normal text-lg leading-7 tracking-normal text-brand-light pt-4`}
                >
                  {step.descriptionHighlight
                    ? (() => {
                        const parts = step.description.split(
                          step.descriptionHighlight,
                        );
                        return (
                          <>
                            {parts[0]}
                            <span
                              className={`${manrope.className} font-medium text-lg leading-relaxed tracking-normal text-brand-gold`}
                            >
                              {step.descriptionHighlight}
                            </span>
                            {parts[1]}
                          </>
                        );
                      })()
                    : step.description}
                </p>
              )}
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
}
