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
    subtitle: "Video a foto",
    description:
      "Krátká i delší videa jsou dnes jedním z nejefektivnějších způsobů, jak předat emoci a zaujmout zákazníky. Vytváříme dynamický video obsah, který funguje na webu i sociálních sítích.",
    keywords: [
      "Reklamní spoty",
      "Produktová videa",
      "Aftermovies",
      "Dronové záběry",
      "Střih a postprodukce",
      "Motion grafika",
    ],
  },
  {
    number: "02",
    title: "Branding",
    subtitle: "Identita",
    description:
      "Branding není jen o logu – je to o příběhu a emocích, které si lidé s vaší značkou spojují. Pomůžeme vám vybudovat konzistentní identitu, která působí profesionálně, je snadno zapamatovatelná a odlišuje vás od konkurence.",
    keywords: [
      "Logo design",
      "Vizuální identita",
      "Brand manuály",
      "Firemní materiály",
      "Tiskoviny a katalogy",
    ],
  },
  {
    number: "03",
    title: "Weby",
    subtitle: "Development",
    description:
      "Web není jen vizitka – je to místo, kde se zákazník rozhoduje. Stavíme weby na míru, které jsou rychlé, bezpečné a přizpůsobené všem zařízením. Postaráme se i o obsah, SEO a dlouhodobý rozvoj.",
    keywords: [
      "UX/UI design",
      "Vývoj webových aplikací",
      "AI chatboti",
      "E-shopy na míru",
      "SEO optimalizace",
      "Webová analytika",
      "Správa obsahu",
    ],
  },
  {
    number: "04",
    title: "Marketing",
    subtitle: "Kampaně",
    description:
      "Marketing děláme s důrazem na strategii a měřitelné výsledky. Pomůžeme vám oslovit ty správné zákazníky, zvýšit povědomí o značce a podpořit prodej. Vše od nápadu po vyhodnocení kampaní.",
    keywords: [
      "Strategie a plánování",
      "PPC kampaně",
      "Obsah pro sociální sítě",
      "Správa a optimalizace kampaní",
      "E-mail marketing",
      "Analýza a reporting",
    ],
  },
  {
    number: "05",
    title: "Filmy",
    subtitle: "Příběhy",
    description:
      "Filmová tvorba umožňuje vyprávět emoce a příběhy, které si lidé pamatují. Od prvního nápadu přes natáčení až po hotový snímek se postaráme o kompletní produkci na vysoké úrovni.",
    keywords: [
      "Dokumentární filmy",
      "Reklamní filmy",
      "Scénář a storyboard",
      "Postprodukce",
      "Storytelling a režie",
    ],
  },
];
