import { groq } from 'next-sanity'

// ─── Settings ────────────────────────────────────────────────────────────────

export const settingsQuery = groq`*[_type == "settings"][0] {
  _id, title, description, logoText, logo,
  socialLinks { instagram, linkedin, facebook, vimeo }
}`

// ─── Pages ───────────────────────────────────────────────────────────────────

const blocksProjection = groq`
  blocks[] {
    _type,
    _key,
    // heroSection
    backgroundImage,
    headline,
    headlineItalic,
    subtitle,
    showScrollIndicator,
    showSocialIcons,
    // servicesListSection
    label,
    leftHeading,
    leftHeadingItalic,
    items[] { number, title, description },
    // featuredWorksSection
    heading,
    showViewAllLink,
    viewAllLabel,
    viewAllSlug,
    projects[]-> { _id, title, client, slug, coverImage, category, excerpt },
    // ctaSection
    buttonLabel,
    buttonLink,
    // quoteSection
    largeHeadline,
    largeHeadlineItalic,
    quoteBoldText,
    quoteRegularText,
    // processSection
    steps[] { number, title, description },
    // twoColumnSection
    rightBodyText,
    // teamSection
    teamMembers[]-> { _id, name, role, email, phone, photo },
    // filmShowcaseSection
    introText,
    films[]-> { _id, title, slug, coverImage, description, director, status },
    // clientsSection
    supportLabel,
    clients[] { name, logo, url },
  }
`

export const homepageQuery = groq`*[_type == "page" && isHomepage == true][0] {
  _id, title, seoTitle, seoDescription, seoImage,
  ${blocksProjection}
}`

export const pageBySlugQuery = groq`*[_type == "page" && slug.current == $slug][0] {
  _id, title, slug, seoTitle, seoDescription, seoImage,
  ${blocksProjection}
}`

export const pagesQuery = groq`*[_type == "page"] | order(_createdAt desc) {
  _id, title, slug, isHomepage
}`

// ─── Projects ─────────────────────────────────────────────────────────────────

export const projectsQuery = groq`*[_type == "project"] | order(publishedAt desc) {
  _id, title, client, slug, coverImage, category, excerpt, publishedAt
}`

export const projectBySlugQuery = groq`*[_type == "project" && slug.current == $slug][0] {
  _id, title, client, slug, coverImage, category, excerpt, body, publishedAt
}`

// ─── Team ─────────────────────────────────────────────────────────────────────

export const teamMembersQuery = groq`*[_type == "teamMember"] | order(order asc) {
  _id, name, role, email, phone, photo
}`

// ─── Films ───────────────────────────────────────────────────────────────────

export const filmsQuery = groq`*[_type == "film"] | order(publishedAt desc) {
  _id, title, slug, coverImage, description, director, production, coproducer, partners, status
}`

// ─── Legacy (kept for compatibility) ─────────────────────────────────────────

export const postsQuery = groq`*[_type == "post"] | order(publishedAt desc) {
  _id, title, slug, excerpt, mainImage, publishedAt
}`

export const postBySlugQuery = groq`*[_type == "post" && slug.current == $slug][0] {
  _id, title, slug, excerpt, mainImage, publishedAt, body
}`
