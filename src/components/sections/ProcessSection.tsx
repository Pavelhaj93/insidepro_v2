type ProcessStep = {
  number?: string;
  title: string;
  description?: string;
};

type Props = {
  label?: string;
  steps?: ProcessStep[];
};

export function ProcessSection({ label, steps = [] }: Props) {
  return (
    <section className="px-8 md:px-12 py-24 bg-brand-dark/20">
      <div className="max-w-screen-xl mx-auto">
        {label && (
          <p className="font-body text-xs tracking-widest text-brand-light/40 uppercase mb-12">
            {label}
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div key={i} className="border border-brand-dark/60 p-6">
              {step.number && (
                <span className="font-display font-bold text-4xl text-brand-bronze/50 block mb-4">
                  {step.number}
                </span>
              )}
              <h3 className="font-display font-bold text-xl uppercase text-brand-light mb-3">
                {step.title}
              </h3>
              {step.description && (
                <p className="font-body text-sm text-brand-light/60 leading-relaxed">
                  {step.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
