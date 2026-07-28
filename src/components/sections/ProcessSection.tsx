import { manrope } from "@/lib/fonts";

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
          <p className="font-body text-lg text-brand-gold tracking-widest  uppercase mb-12 font-medium">
            {label}
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div
              key={i}
              className="border border-brand-dark/60 p-6 bg-brand-grey rounded-md"
            >
              {step.number && (
                <span className="font-display font-bold text-4xl sm:text-5xl lg:text-7xl text-brand-gold-light block mb-20">
                  {step.number}
                </span>
              )}
              <h3 className="font-display font-black leading-8 text-2xl uppercase text-brand-light mb-3 border-b-brand-gold-light border-b pb-8">
                {step.title}
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
