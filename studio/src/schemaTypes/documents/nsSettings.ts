import { defineArrayMember, defineField, defineType } from 'sanity'

// Singleton holding the whole nonshoots.com one-pager (Jan Rajnoha's personal site).
// The site is a separate Next app that reads this dataset; films and videos are shared with insidePRO.
export const nsSettings = defineType({
  name: 'nsSettings',
  title: 'Non Shoots – úvodní stránka',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Úvod', default: true },
    { name: 'about', title: 'O mně' },
    { name: 'showreel', title: 'Showreel' },
    { name: 'films', title: 'Filmy' },
    { name: 'commercial', title: 'Komerční práce' },
    { name: 'contact', title: 'Kontakt' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // Hero
    defineField({
      name: 'heroImage',
      title: 'Úvodní fotka',
      type: 'image',
      group: 'hero',
      options: { hotspot: true },
      description: 'Velká fotka přes celou šířku nahoře na stránce. Logo Non Shoots se zobrazí přes ni.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      group: 'hero',
      description: 'Logo Non Shoots přes úvodní fotku — ideálně SVG nebo PNG s průhledným pozadím. Když chybí, zobrazí se jen podtitulek.',
    }),
    defineField({
      name: 'tagline',
      title: 'Podtitulek',
      type: 'string',
      group: 'hero',
      initialValue: 'Director. Producer. Cinematographer',
      description: 'Krátký text pod logem.',
    }),
    defineField({
      name: 'navItems',
      title: 'Menu',
      type: 'array',
      group: 'hero',
      description: 'Položky v horním menu. Každá vede buď na sekci této stránky, nebo na samostatnou stránku.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'nsNavItem',
          title: 'Položka menu',
          fields: [
            defineField({ name: 'label', title: 'Text', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({
              name: 'section',
              title: 'Sekce na stránce',
              type: 'string',
              description: 'Vyplňte buď sekci, nebo stránku níže.',
              options: {
                list: [
                  { title: 'O mně', value: 'about' },
                  { title: 'Showreel', value: 'showreel' },
                  { title: 'Filmy', value: 'films' },
                  { title: 'Komerční práce', value: 'commercial' },
                  { title: 'Kontakt', value: 'contact' },
                ],
              },
            }),
            defineField({
              name: 'page',
              title: 'Samostatná stránka',
              type: 'reference',
              to: [{ type: 'nsPage' }],
            }),
          ],
          validation: (Rule) =>
            Rule.custom((item: { section?: string; page?: unknown } | undefined) =>
              item?.section || item?.page ? true : 'Vyberte sekci nebo stránku',
            ),
          preview: {
            select: { title: 'label', section: 'section', page: 'page.title' },
            prepare: ({ title, section, page }) => ({
              title,
              subtitle: page ? `Stránka: ${page}` : section ? `Sekce: ${section}` : 'Bez odkazu',
            }),
          },
        }),
      ],
    }),

    // About
    defineField({
      name: 'introHeadline',
      title: 'Hlavní nadpis',
      type: 'string',
      group: 'about',
      initialValue: 'Hi my name is Jan',
    }),
    defineField({
      name: 'portrait',
      title: 'Portrét',
      type: 'image',
      group: 'about',
      options: { hotspot: true },
    }),
    defineField({
      name: 'aboutHeading',
      title: 'Nadpis „O mně“',
      type: 'string',
      group: 'about',
      initialValue: 'About me',
    }),
    defineField({
      name: 'about',
      title: 'Text „O mně“',
      type: 'array',
      group: 'about',
      description: 'Jeden blok = jeden odstavec. Označený text lze zvýraznit zlatou barvou (tlačítko „Zlatá“).',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [{ title: 'Normální', value: 'normal' }],
          lists: [],
          marks: {
            decorators: [
              { title: 'Tučně', value: 'strong' },
              { title: 'Kurzíva', value: 'em' },
              { title: 'Zlatá', value: 'gold' },
            ],
            annotations: [],
          },
        }),
      ],
    }),

    defineField({
      name: 'supportedBy',
      title: 'Podpora (Supported by)',
      type: 'string',
      group: 'about',
      description: 'Zobrazí se vpravo pod textem jako „Supported by: …“, např. „SONY CZ/SK“. Prázdné = řádek se nezobrazí.',
    }),

    // Showreel
    defineField({
      name: 'showreelVideo',
      title: 'Showreel video',
      type: 'reference',
      group: 'showreel',
      to: [{ type: 'video' }],
      description: 'Video z knihovny „Video“ (nahrané do Muxu). Případný text patří přímo do videa — web přes něj nic nepíše.',
    }),

    // Films
    defineField({
      name: 'filmsHeading',
      title: 'Nadpis sekce',
      type: 'string',
      group: 'films',
      initialValue: 'Films',
    }),
    defineField({
      name: 'films',
      title: 'Filmy',
      type: 'array',
      group: 'films',
      description:
        'Plakát, název a stav se berou z filmu sdíleného s webem insidePRO. Anglické texty na kartě se vyplňují tady a na insidePRO se neprojeví.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'nsFilmItem',
          title: 'Film',
          fields: [
            defineField({
              name: 'film',
              title: 'Film',
              type: 'reference',
              to: [{ type: 'film' }],
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'format',
              title: 'Formát a délka',
              type: 'string',
              description: 'Např. „Feature Documentary | 72 min“ nebo „Documentary Series | 6 × 35 min“.',
            }),
            defineField({
              name: 'locations',
              title: 'Místa natáčení (Filming Locations)',
              type: 'string',
              description: 'Např. „Peru, Ecuador, USA, Switzerland“.',
            }),
            defineField({
              name: 'director',
              title: 'Režie (Director)',
              type: 'string',
              description: 'Více jmen oddělte čárkou — web pak napíše „Directors“.',
            }),
            defineField({ name: 'production', title: 'Produkce (Production)', type: 'string' }),
            defineField({ name: 'coproduction', title: 'Koprodukce (Co-production)', type: 'string' }),
            defineField({ name: 'supportedBy', title: 'Podpora (Supported by)', type: 'string' }),
          ],
          preview: {
            select: { title: 'film.title', format: 'format', media: 'film.cardImage' },
            prepare: ({ title, format, media }) => ({ title: title ?? 'Vyberte film', subtitle: format, media }),
          },
        }),
      ],
    }),

    // Commercial work
    defineField({
      name: 'commercialHeading',
      title: 'Nadpis sekce',
      type: 'string',
      group: 'commercial',
      initialValue: 'Commercial work',
    }),
    defineField({
      name: 'commercialVideos',
      title: 'Videa',
      type: 'array',
      group: 'commercial',
      description: 'Zobrazí se v mřížce dvě vedle sebe.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'nsCommercialItem',
          title: 'Video',
          fields: [
            defineField({
              name: 'video',
              title: 'Video',
              type: 'reference',
              to: [{ type: 'video' }],
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'title',
              title: 'Název (volitelné)',
              type: 'string',
              description: 'Když zůstane prázdné, použije se název videa.',
            }),
            defineField({ name: 'client', title: 'Klient (volitelné)', type: 'string' }),
          ],
          preview: {
            select: { title: 'title', videoTitle: 'video.title', client: 'client', media: 'video.poster' },
            prepare: ({ title, videoTitle, client, media }) => ({
              title: title || videoTitle,
              subtitle: client,
              media,
            }),
          },
        }),
      ],
    }),

    // Contact
    defineField({
      name: 'contactHeading',
      title: 'Nadpis',
      type: 'string',
      group: 'contact',
      initialValue: 'Hit me up!',
    }),
    defineField({
      name: 'contactSubheading',
      title: 'Podnadpis',
      type: 'string',
      group: 'contact',
      initialValue: 'Available for worldwide',
    }),
    defineField({
      name: 'email',
      title: 'E-mail',
      type: 'string',
      group: 'contact',
      validation: (Rule) => Rule.email(),
    }),
    defineField({ name: 'phone', title: 'Telefon', type: 'string', group: 'contact' }),
    defineField({
      name: 'socialLinks',
      title: 'Sociální sítě',
      type: 'object',
      group: 'contact',
      description: 'Ikony se zobrazí v úvodu a v kontaktu. Prázdné pole = ikona se nezobrazí.',
      fields: [
        defineField({ name: 'instagram', title: 'Instagram', type: 'url' }),
        defineField({ name: 'linkedin', title: 'LinkedIn', type: 'url' }),
        defineField({ name: 'facebook', title: 'Facebook', type: 'url' }),
        defineField({ name: 'vimeo', title: 'Vimeo', type: 'url' }),
      ],
    }),

    // SEO
    defineField({ name: 'metaTitle', title: 'Titulek stránky', type: 'string', group: 'seo' }),
    defineField({
      name: 'metaDescription',
      title: 'Popis pro vyhledávače',
      type: 'text',
      rows: 3,
      group: 'seo',
      validation: (Rule) => Rule.max(160).warning('Vyhledávače zobrazí zhruba 160 znaků.'),
    }),
    defineField({
      name: 'ogImage',
      title: 'Obrázek pro sdílení',
      type: 'image',
      group: 'seo',
      description: 'Náhled při sdílení odkazu (Facebook, LinkedIn…). Když chybí, použije se úvodní fotka.',
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Non Shoots – úvodní stránka' }),
  },
})
