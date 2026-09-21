import { groq } from "next-sanity";

// Appended to a bare image field's projection to pull its LQIP blur-up
// placeholder alongside everything `urlFor()` needs (asset ref, hotspot,
// crop) — see skills/sanity-best-practices/references/image.md.
export const lqip = groq`..., "lqip": asset->metadata.lqip`;

// Shared field set for a "project" or "film" document rendered as a card in
// the /reference grid — normalizes the two shapes (film has "description"
// where project has "excerpt", no "cardImage") into one object. Used by both
// blocksProjection's referenceWorksSection branch and FALLBACK_QUERY in
// src/app/reference/page.tsx — keep both call sites in sync.
export const referenceItemFields = groq`
  _type, _id, title, client, slug, coverImage { ${lqip} }, cardImage { ${lqip} },
  "excerpt": select(_type == "film" => description, excerpt),
  "categories": categories[]-> { _id, title, "slug": slug.current },
  "hasCaseStudy": defined(synopsis) || count(gallery) > 0 || defined(trailerVideo)
`;

// ─── Settings ────────────────────────────────────────────────────────────────

export const settingsQuery = groq`*[_type == "settings"][0] {
  _id, title, description, logoText, logo { ${lqip} },
  socialLinks { instagram, linkedin, facebook, vimeo }
}`;

// ─── Footer ──────────────────────────────────────────────────────────────────

export const footerQuery = groq`*[_type == "footer"][0] {
  headingLine1, headingLine2, headingHighlight, backgroundImage,
  email, phone, copyrightText, legalText
}`;

// ─── Pages ───────────────────────────────────────────────────────────────────

const blocksProjection = groq`
  blocks[] {
    _type,
    _key,
    // heroSection
    backgroundImage { ${lqip} },
    backgroundImageMobile { ${lqip} },
    backgroundVideo { asset->{ url, mimeType } },
    backgroundVideoMobile { asset->{ url, mimeType } },
    headline,
    subtitle,
    showScrollIndicator,
    showSocialIcons,
    // splitVideoRevealSection
    kicker,
    cornerHeadline,
    video { asset->{ url, mimeType } },
    mobileVideo { asset->{ url, mimeType } },
    posterImage,
    // servicesListSection / servicesAccordionSection
    label,
    leftHeading,
    items[] { number, title, subtitle, description, linkLabel, link, keywords },
    // whoWeAreSection
    eyebrow,
    missionText,
    leftPhotos[] { ${lqip} },
    rightImage { ${lqip} },
    badgeText,
    // zoomTextSection
    accentColor,
    anchorIndex,
    // featuredWorksSection
    heading,
    showViewAllLink,
    viewAllLabel,
    viewAllSlug,
    _type == "featuredWorksSection" => {
      projects[]-> { _id, title, client, slug, coverImage { ${lqip} }, cardImage { ${lqip} }, category, excerpt },
    },
    // referenceWorksSection — "projects" is an explicit, ordered curation
    // picked in Studio; falls back to every project/film tagged with one of
    // the selected categories when nothing's been curated yet. Merges
    // "project" and "film" documents into one normalized shape — keep this
    // in sync with FALLBACK_QUERY in src/app/reference/page.tsx.
    allLabel,
    _type == "referenceWorksSection" => {
      "categories": categories[]-> { _id, title, "slug": slug.current, order, "videoUrl": video.asset->url },
      "projects": select(
        count(projects) > 0 => projects[]-> {
          ${referenceItemFields}
        },
        *[_type in ["project", "film"] && references(^.categories[]._ref)] | order(publishedAt desc) {
          ${referenceItemFields}
        }
      ),
    },
    // ctaSection
    buttonLabel,
    buttonLink,
    // quoteSection
    largeHeadline,
    largeHeadlineItalic,
    quoteBoldText,
    quoteRegularText,
    // processSection
    steps[] { number, title, description, descriptionHighlight },
    // twoColumnSection
    rightBodyText,
    // teamSection
    teamMembers[]-> { _id, name, role, email, phone, photo { ${lqip} } },
    outroText,
    outroHighlight,
    ctaLabel,
    ctaLink,
    lightBackground,
    // filmShowcaseSection
    introText,
    films[]-> {
      _id, title, slug, coverImage { ${lqip} }, cardImage { ${lqip} }, description, director, production, coproducer, partners, status,
      "hasCaseStudy": defined(synopsis) || count(gallery) > 0 || defined(trailerVideo)
    },
    // clientsSection
    supportLabel,
    layout,
    clients[] {
      _type != "reference" => { name, logo { ${lqip} }, url, backgroundImage { ${lqip} }, quote, tagline },
      _type == "reference" => @-> {
        "name": coalesce(client, title),
        "backgroundImage": coverImage { ${lqip} },
        body,
        "tagline": excerpt,
        "slug": slug.current,
        hoverVideo-> { file { asset->{ url, mimeType } } },
      },
    },
    // imageSection
    image { asset->{ url, metadata { dimensions { width, height }, lqip } }, alt, hotspot },
    // infoBoxSection
    boxTitle,
    boxDescription,
    // featureCardsSection
    cards[] { _key, title, bullets },
    // richTextSection
    title,
    body,
    // textBlock
    number,
    // logoWallSection
    topRowLogos[]-> { _id, name, image { ${lqip} }, url },
    bottomRowLogos[]-> { _id, name, image { ${lqip} }, url },
    // separator
    width,
    // contactFormSection
    headingLine1,
    headingLine2,
    successMessage,
  }
`;

export const homepageQuery = groq`*[_type == "page" && isHomepage == true][0] {
  _id, title, seoTitle, seoDescription, seoImage,
  ${blocksProjection}
}`;

export const pageBySlugQuery = groq`*[_type == "page" && slug.current == $slug][0] {
  _id, title, slug, seoTitle, seoDescription, seoImage, isPublished,
  ${blocksProjection}
}`;

export const pagesQuery = groq`*[_type == "page"] | order(_createdAt desc) {
  _id, title, slug, isHomepage, isPublished
}`;

// Used by the showcase /reference route to pull its Reference Works Section
// block's config (heading, categories, curated projects) straight off the
// `page` document with that same slug — reuses the same `blocksProjection`
// the generic page-builder pipeline uses, so the two never drift apart.
export const referencePageQuery = groq`*[_type == "page" && slug.current == "reference"][0] {
  ${blocksProjection}
}`;

// ─── Projects ─────────────────────────────────────────────────────────────────

export const projectsQuery = groq`*[_type == "project"] | order(publishedAt desc) {
  _id, title, client, slug, coverImage, category, excerpt, publishedAt
}`;

export const projectBySlugQuery = groq`*[_type == "project" && slug.current == $slug][0] {
  _id, title, client, slug, coverImage, category, excerpt, body, publishedAt
}`;

// ─── Reference project ordering (case-study prev/next nav) ──────────────────
// Lean counterpart to blocksProjection's referenceWorksSection branch above —
// same curated-projects-else-category-tagged-projects cascade, but only the
// fields the prev/next nav needs (no images/excerpt/categories). Keep the
// select() shape in sync with that branch if it ever changes.
export const referenceWorksOrderQuery = groq`*[_type == "page" && slug.current == "reference"][0] {
  "blocks": blocks[_type == "referenceWorksSection"][0] {
    "hasCategories": count(categories) > 0,
    "projects": select(
      count(projects) > 0 => projects[]-> {
        _id, _type, title, "slug": slug.current,
        "hasCaseStudy": defined(synopsis) || count(gallery) > 0 || defined(trailerVideo)
      },
      *[_type in ["project", "film"] && references(^.categories[]._ref)] | order(publishedAt desc) {
        _id, _type, title, "slug": slug.current,
        "hasCaseStudy": defined(synopsis) || count(gallery) > 0 || defined(trailerVideo)
      }
    )
  }
}`;

// Page-level fallback used when the "reference" page doc doesn't exist yet,
// or its referenceWorksSection has no categories configured — mirrors
// FALLBACK_QUERY in src/app/reference/page.tsx exactly (keep both in sync).
export const allProjectsOrderQuery = groq`*[_type in ["project", "film"]] | order(publishedAt desc) {
  _id, _type, title, "slug": slug.current,
  "hasCaseStudy": defined(synopsis) || count(gallery) > 0 || defined(trailerVideo)
}`;

// ─── Team ─────────────────────────────────────────────────────────────────────

export const teamMembersQuery = groq`*[_type == "teamMember"] | order(order asc) {
  _id, name, role, email, phone, photo
}`;

// ─── Films ───────────────────────────────────────────────────────────────────

export const filmsQuery = groq`*[_type == "film"] | order(publishedAt desc) {
  _id, title, slug, coverImage, cardImage, description, director, genre, country, production, coproducer, partners, status,
  yearOfProduction, synopsis, gallery, trailerVideo,
  "categories": categories[]-> { _id, title, "slug": slug.current }
}`;

// ─── Reference detail (case-study page, project OR film by slug) ────────────

export const referenceDetailQuery = groq`*[(_type == "project" || _type == "film") && slug.current == $slug][0] {
  _type,
  _id,
  title,
  "slug": slug.current,
  client,
  websiteUrl,
  coverImage { ${lqip} },
  "categories": categories[]->title,
  excerpt,
  body,
  gallery[] { ${lqip} },
  behindTheScenesGallery[] { ${lqip} },
  projectVideos[]-> { file { asset->{ url, mimeType } }, poster },
  // film-only fields (undefined on "project" docs)
  description,
  yearOfProduction,
  director,
  genre,
  country,
  production,
  coproducer,
  partners,
  status,
  synopsis,
  trailerVideo-> { file { asset->{ url, mimeType } }, poster }
}`;

// ─── Legacy (kept for compatibility) ─────────────────────────────────────────

export const postsQuery = groq`*[_type == "post"] | order(publishedAt desc) {
  _id, title, slug, excerpt, mainImage, publishedAt
}`;

export const postBySlugQuery = groq`*[_type == "post" && slug.current == $slug][0] {
  _id, title, slug, excerpt, mainImage, publishedAt, body
}`;
