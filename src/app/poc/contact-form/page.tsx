import { ContactFormPocVariants } from "@/components/sections/contact-form-poc/ContactFormPocVariants";

/**
 * Standalone POC route — not linked from any nav, not backed by Sanity, no
 * real submit handling. Visit locally at /poc/contact-form and use the
 * top-right A/B/C switcher to compare the three original contact-form
 * designs. See the plan doc for what happens once a direction is picked.
 */
export default function ContactFormPocPage() {
  return (
    <main className="min-h-screen bg-brand-black text-brand-light">
      <section className="flex min-h-[40vh] flex-col items-center justify-center gap-4 px-8 text-center">
        <p className="font-body text-sm tracking-widest uppercase text-brand-gold">
          Contact Form — Proof of Concept
        </p>
        <h1 className="font-display font-black uppercase text-4xl leading-tight sm:text-5xl">
          Přepínej vpravo nahoře
        </h1>
        <p className="font-body max-w-xl text-brand-light/70">
          Tři originální varianty kontaktního formuláře. Žádná neodesílá nikam
          doopravdy — jen simulují úspěšné odeslání.
        </p>
      </section>

      <ContactFormPocVariants />
    </main>
  );
}
