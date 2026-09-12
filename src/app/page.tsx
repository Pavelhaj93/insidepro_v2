import { groq } from "next-sanity";
import { SplitVideoReveal } from "@/components/motion/SplitVideoReveal";
import { CtaSection } from "@/components/sections/CtaSection";
import { client } from "@/sanity/lib/client";
import { settingsQuery, teamMembersQuery } from "@/sanity/lib/queries";
import { ServicesAccordion } from "@/components/home/ServicesAccordion";
import { WhoWeAreSection } from "@/components/home/WhoWeAreSection";
import { ClientShowcaseHorizontal } from "@/components/home/ClientShowcaseHorizontal";
import { LogoCarousel } from "@/components/home/LogoCarousel";
import { TeamShowcaseSection } from "@/components/home/TeamShowcaseSection";

// Same clients data the previous homepage's `ClientsShowcaseSection` used
// (see `blocksProjection` in src/sanity/lib/queries.ts) — pulled directly
// here since this page only needs the one block, not the full projection.
const CLIENTS_QUERY = groq`*[_type == "page" && isHomepage == true][0].blocks[_type == "clientsSection"][0]{
  clients[]{
    _type != "reference" => { name, logo, url, backgroundImage, tagline },
    _type == "reference" => @-> { "name": coalesce(client, title), "backgroundImage": coverImage, "tagline": excerpt, "slug": slug.current }
  }
}`;

// Real logo images live here, not on clientsSection.clients[] (which this
// dataset only ever populated with bare names, no images) — same source
// LogoWallSection.tsx uses.
const LOGOS_QUERY = groq`*[_type == "page" && isHomepage == true][0].blocks[_type == "logoWallSection"][0].logos[]-> {
  _id, name, image, url
}`;

// Reuses the real CTA content/component rather than a mock section.
const CTA_QUERY = groq`*[_type == "page" && isHomepage == true][0].blocks[_type == "ctaSection"][0]{
  headline, backgroundImage, buttonLabel, buttonLink
}`;

/**
 * Showcase homepage: scroll-driven split-panel video-reveal hero (using a
 * real hero video hosted on Sanity's CDN), services accordion, "Who We Are",
 * logo marquee, and client showcase — hardcoded for this showcase rather
 * than driven by the `homepageQuery`/`SectionRenderer` blocks pipeline.
 * The reference/works showcase lives on its own route, see `/reference`.
 */

const HERO_VIDEO_SRC =
  "https://cdn.sanity.io/files/4mvdpq34/production/bf7a1ec8045d083288c54c2fda0ac1a90c39b733.mp4";

export default async function HomePage() {
  const [settings, clientsBlock, logos, cta, teamMembers] = await Promise.all([
    client.fetch(settingsQuery),
    client.fetch(CLIENTS_QUERY),
    client.fetch(LOGOS_QUERY),
    client.fetch(CTA_QUERY),
    client.fetch(teamMembersQuery),
  ]);

  return (
    <main className="bg-brand-black text-brand-light">
      <SplitVideoReveal videoSrc={HERO_VIDEO_SRC} />

      <ServicesAccordion />

      <WhoWeAreSection logo={settings?.logo ?? null} />

      <LogoCarousel logos={logos} />

      <ClientShowcaseHorizontal clients={clientsBlock?.clients} />

      <TeamShowcaseSection teamMembers={teamMembers} />

      {cta && <CtaSection {...cta} />}
    </main>
  );
}
