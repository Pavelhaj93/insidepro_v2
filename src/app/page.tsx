import { groq } from "next-sanity";
import { SplitVideoReveal } from "@/components/motion/SplitVideoReveal";
import { ZoomTextTransition } from "@/components/motion/ZoomTextTransition";
import { client } from "@/sanity/lib/client";
import { footerQuery, settingsQuery, teamMembersQuery } from "@/sanity/lib/queries";
import { ServicesAccordion } from "@/components/home/ServicesAccordion";
import { WhoWeAreSection } from "@/components/home/WhoWeAreSection";
import { ClientShowcaseHorizontal } from "@/components/home/ClientShowcaseHorizontal";
import { LogoCarousel } from "@/components/home/LogoCarousel";
import { TeamShowcaseSection } from "@/components/home/TeamShowcaseSection";
import { HomeCtaFooter } from "@/components/home/HomeCtaFooter";

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
  const [settings, clientsBlock, logos, footer, teamMembers] =
    await Promise.all([
      client.fetch(settingsQuery),
      client.fetch(CLIENTS_QUERY),
      client.fetch(LOGOS_QUERY),
      client.fetch(footerQuery),
      client.fetch(teamMembersQuery),
    ]);

  return (
    <main className="bg-brand-black text-brand-light">
      <SplitVideoReveal videoSrc={HERO_VIDEO_SRC} />

      <ServicesAccordion />

      <WhoWeAreSection logo={settings?.logo ?? null} />

      <LogoCarousel logos={logos} />

      <ClientShowcaseHorizontal clients={clientsBlock?.clients} />

      <ZoomTextTransition
        headline="PŘÍBĚH KTERÝ VÁS POHLTÍ"
        accentColor="var(--color-brand-light)"
        scrollHeightVh={330}
        // Index 8 — the "T" in "KTERÝ" — instead of the auto-picked nearest-
        // to-middle char (which landed on the accented "Ý" right after it).
        anchorIndex={8}
      />

      <TeamShowcaseSection teamMembers={teamMembers} invert />

      <HomeCtaFooter
        headingLine1={footer?.headingLine1}
        headingLine2={footer?.headingLine2}
        email={footer?.email}
        phone={footer?.phone}
        socialLinks={settings?.socialLinks ?? null}
        copyrightText={footer?.copyrightText}
        legalText={footer?.legalText}
      />
    </main>
  );
}
