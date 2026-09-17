/**
 * Design-POC placeholder copy for the full-width case-study layout experiment
 * (/reference/[slug]/poc). Not real Medifree content — swap for actual
 * client-approved copy once a variant is chosen and wired to a real CMS field.
 *
 * `sections` gives each narrative chunk a number + title (same "01 + heading"
 * language as ProcessSection/ServicesListSection elsewhere on the site)
 * instead of a bare paragraph — see PocTextBlock.
 */
export const POC_COPY = {
  sections: [
    {
      number: "01",
      title: "Zadání",
      text: "Medifree přišel s jasným zadáním: postavit digitální přítomnost, které lidé věří stejně jako doporučení od lékaře. Naším úkolem bylo spojit odbornost s přístupností a proměnit komplexní téma zdraví v srozumitelný, důvěryhodný zážitek.",
    },
    {
      number: "02",
      title: "Spolupráce",
      text: "Spolupráci jsme postavili na úzkém propojení brandingu, webu a obsahu — od vizuální identity přes UX web aplikace až po produkční materiály, které Medifree používá napříč kanály. Výsledkem je konzistentní systém, který roste spolu s produktem.",
    },
    {
      number: "03",
      title: "Výsledek",
      text: "Dnes Medifree funguje jako jeden vizuální a obsahový celek — na webu, v appce i v marketingových materiálech. Tenhle POC ukazuje jen jeden z možných způsobů, jak tenhle příběh vyprávět.",
    },
  ],
  quote: {
    bold: "Potřebovali jsme partnera, ne dodavatele.",
    regular:
      "Tým dokázal přeložit medicínskou terminologii do jazyka, kterému lidé rozumí — a přitom neztratit důvěryhodnost.",
  },
};

// Reused from the homepage hero (src/app/page.tsx) purely as POC placeholder
// footage — swap for a real Medifree video asset once one exists.
export const POC_VIDEO_SRC =
  "https://cdn.sanity.io/files/4mvdpq34/production/bf7a1ec8045d083288c54c2fda0ac1a90c39b733.mp4";
