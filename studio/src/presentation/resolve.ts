import { defineDocuments, defineLocations, type PresentationPluginOptions } from 'sanity/presentation'

// Maps front-end routes (src/app/) to documents and back, so Presentation opens
// the right document next to the preview and documents list the pages using them.
export const resolve: PresentationPluginOptions['resolve'] = {
  mainDocuments: defineDocuments([
    { route: '/', filter: `_type == "page" && isHomepage == true` },
    // `/reference` is its own route but reads the `page` with slug "reference".
    { route: '/reference', filter: `_type == "page" && slug.current == "reference"` },
    { route: '/reference/:slug', filter: `_type in ["project", "film"] && slug.current == $slug` },
    { route: '/:slug', filter: `_type == "page" && slug.current == $slug` },
  ]),
  locations: {
    page: defineLocations({
      select: { title: 'title', slug: 'slug.current', isHomepage: 'isHomepage' },
      resolve: (doc) => ({
        locations: doc?.isHomepage
          ? [{ title: doc.title || 'Domovská stránka', href: '/' }]
          : doc?.slug
            ? [{ title: doc.title || 'Bez názvu', href: `/${doc.slug}` }]
            : [],
      }),
    }),
    project: defineLocations({
      select: { title: 'title', slug: 'slug.current' },
      resolve: (doc) => ({
        locations: doc?.slug
          ? [
              { title: doc.title || 'Bez názvu', href: `/reference/${doc.slug}` },
              { title: 'Reference', href: '/reference' },
            ]
          : [],
      }),
    }),
    film: defineLocations({
      select: { title: 'title', slug: 'slug.current' },
      resolve: (doc) => ({
        locations: doc?.slug
          ? [
              { title: doc.title || 'Bez názvu', href: `/reference/${doc.slug}` },
              { title: 'Reference', href: '/reference' },
            ]
          : [],
      }),
    }),
    category: defineLocations({
      locations: [{ title: 'Reference', href: '/reference' }],
    }),
    settings: defineLocations({
      message: 'Zobrazuje se na všech stránkách',
      tone: 'positive',
      locations: [{ title: 'Domovská stránka', href: '/' }],
    }),
    footer: defineLocations({
      message: 'Zobrazuje se na všech stránkách',
      tone: 'positive',
      locations: [{ title: 'Domovská stránka', href: '/' }],
    }),
  },
}
