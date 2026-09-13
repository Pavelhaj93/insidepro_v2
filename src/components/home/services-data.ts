export type Service = {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  keywords: string[];
};

// Mock copy, same as the rest of this POC page — not backed by Sanity.
// Deliberately covers the full offering (not just 3 items) so nothing gets
// missed on first glance: production, brand, web, marketing, film.
// `keywords` are concrete sub-offerings shown alongside the description, so
// a glance tells you specifics (e.g. "AI chatboti") not just a category name.
// Shared by both ServicesAccordion interaction variants (scroll and click).
export const SERVICES: Service[] = [
  {
    number: "01",
    title: "Produkce",
    subtitle: "Video & foto",
    description:
      "Od prvního námětu po finální výstup. Zajišťujeme kompletní video a fotoprodukci včetně přípravy, natáčení a postprodukce.",
    keywords: [
      "Reklamní spoty",
      "Brandová videa",
      "Produktová videa",
      "Foto produkce",
      "Content",
      "Postprodukce",
      "Motion & 3D",
    ],
  },
  {
    number: "02",
    title: "Branding",
    subtitle: "Identita",
    description:
      "Tvoříme vizuální identity, které dávají značce jasný charakter a drží pohromadě napříč celou komunikací.",
    keywords: [
      "Logo design",
      "Vizuální identita",
      "Brand manuály",
      "Grafický design",
      "Kampaně",
      "Firemní materiály",
    ],
  },
  {
    number: "03",
    title: "Weby",
    subtitle: "Design & Development",
    description:
      "Navrhujeme a vyvíjíme weby na míru. Od UX a vizuálního návrhu přes vývoj až po obsah, SEO a dlouhodobou správu.",
    keywords: [
      "UX/UI design",
      "Web development",
      "E-shopy",
      "SEO",
      "Webová analytika",
      "Správa & rozvoj",
    ],
  },
  {
    number: "04",
    title: "Marketing",
    subtitle: "Strategie & kampaně",
    description:
      "Stavíme marketing jako jeden funkční systém. Propojujeme strategii, obsah, kampaně a výkon a dlouhodobě řídíme jejich výsledky.",
    keywords: [
      "Strategie",
      "PPC kampaně",
      "Social media",
      "Content marketing",
      "Správa kampaní",
      "Reporting & optimalizace",
    ],
  },
  {
    number: "05",
    title: "Filmy",
    subtitle: "Příběhy",
    description:
      "Vyvíjíme a natáčíme autorské dokumentární a celovečerní projekty určené pro domácí i mezinárodní distribuci.",
    keywords: [
      "Dokumentární filmy",
      "Seriály",
      "Vývoj & scénář",
      "Mezinárodní produkce",
      "Distribuce",
    ],
  },
];
