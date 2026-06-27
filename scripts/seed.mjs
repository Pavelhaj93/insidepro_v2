/**
 * One-time seed script — creates all 6 pages + supporting documents in Sanity.
 * Run: node --env-file=.env.local scripts/seed.mjs
 */

import { createClient } from '@sanity/client'
import { randomUUID } from 'crypto'

const token = process.env.SANITY_API_WRITE_TOKEN
if (!token) {
  console.error('Missing SANITY_API_WRITE_TOKEN in .env.local')
  process.exit(1)
}

const client = createClient({
  projectId: '4mvdpq34',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
})

const key = () => randomUUID().replace(/-/g, '').substring(0, 12)

// ─── Step 1: Team Members ────────────────────────────────────────────────────
console.log('\n📋 Creating team members...')

const teamData = [
  { name: 'Jan Rajnoha',          role: 'Founder, Executive Producer & Director', email: 'rajnoha@insidepro.cz',   phone: '+420 731 727 306', order: 1 },
  { name: 'Ing. Sandra Bartelová',role: 'Marketing Manager & PPC Specialist',      email: 'bartelova@insidepro.cz', phone: '+420 736 659 723', order: 2 },
  { name: 'Petr Sochor',          role: 'Production & Client Manager',             email: 'sochor@insidepro.cz',    phone: '+420 739 044 381', order: 3 },
  { name: 'Ondřej Marek',         role: 'Brand Strategist & Graphic Designer',     email: 'marek@insidepro.cz',     phone: '+420 736 534 697', order: 4 },
  { name: 'Pavel Hajduch',        role: 'Web Developer & SEO Specialist',          email: 'hajduch@insidepro.cz',   phone: '+420 720 989 429', order: 5 },
  { name: 'Matěj Sládek',         role: 'Photographer & Visual Creator',           email: 'sladek@insidepro.cz',    phone: '+420 602 241 866', order: 6 },
]

const teamDocs = await Promise.all(
  teamData.map(d => client.create({ _type: 'teamMember', ...d }))
)
teamDocs.forEach(d => console.log(`  ✓ ${d.name} (${d._id})`))

// ─── Step 2: Films ────────────────────────────────────────────────────────────
console.log('\n🎬 Creating films...')

const filmData = [
  {
    title: 'The Inside of Us',
    slug: { _type: 'slug', current: 'the-inside-of-us' },
    status: 'in-post-production',
    director: 'Jan Rajnoha',
    production: 'insidePRO',
    coproducer: 'KJ Production 21 / Analog Vision',
    partners: 'Karel Janeček, Václav Dejčmar',
    description: 'Celovečerní dokumentární film o lidech, kteří jdou za svými sny navzdory všemu.',
  },
  {
    title: 'YACHAK',
    slug: { _type: 'slug', current: 'yachak' },
    status: 'in-production',
    director: 'Jan Rajnoha',
    production: 'Analog Vision',
    coproducer: 'insidePRO',
    partners: 'Mendelova univerzita v Brně, United Nations (OSN), Sigma, Sony',
    description: 'Dokumentární film o domorodém vědění a jeho propojení s moderní vědou.',
  },
  {
    title: 'UNDERTAKER',
    slug: { _type: 'slug', current: 'undertaker' },
    status: 'finishing',
    director: 'Jan Rajnoha',
    production: 'Analog Vision',
    coproducer: 'insidePRO',
    description: 'Film o pohřebnictví jako profesi a o vztahu člověka ke smrti.',
  },
  {
    title: 'BEYOND TOMORROW',
    slug: { _type: 'slug', current: 'beyond-tomorrow' },
    status: 'in-development',
    director: 'Jan Rajnoha, Michal Gálik',
    production: 'Analog Vision',
    coproducer: 'insidePRO',
    description: 'Pohled na budoucnost lidstva a technologií očima těch, kdo ji tvoří.',
  },
]

const filmDocs = await Promise.all(
  filmData.map(d => client.create({ _type: 'film', ...d }))
)
filmDocs.forEach(d => console.log(`  ✓ ${d.title} (${d._id})`))

// ─── Step 3: Projects ─────────────────────────────────────────────────────────
console.log('\n🗂  Creating projects...')

const projectData = [
  {
    title: 'FERI',
    client: 'FERI',
    slug: { _type: 'slug', current: 'feri' },
    category: 'branding',
    excerpt: 'Významná česká stavební firma. Kompletní rebrand od loga po manuál.',
    publishedAt: new Date().toISOString(),
  },
  {
    title: 'ISCARE',
    client: 'ISCARE',
    slug: { _type: 'slug', current: 'iscare' },
    category: 'marketing',
    excerpt: 'Prestižní soukromá klinika. Strategická komunikace a správa kampaní.',
    publishedAt: new Date().toISOString(),
  },
  {
    title: 'Kingspan',
    client: 'Kingspan',
    slug: { _type: 'slug', current: 'kingspan' },
    category: 'produkce',
    excerpt: 'Globální lídr ve svém oboru. Komerční video produkce pro mezinárodní trh.',
    publishedAt: new Date().toISOString(),
  },
]

const projectDocs = await Promise.all(
  projectData.map(d => client.create({ _type: 'project', ...d }))
)
projectDocs.forEach(d => console.log(`  ✓ ${d.title} (${d._id})`))

// ─── Helpers ──────────────────────────────────────────────────────────────────
const ref = (id) => ({ _type: 'reference', _ref: id })

// ─── Step 4: Pages ────────────────────────────────────────────────────────────
console.log('\n📄 Creating pages...')

const pages = [
  // ── Homepage ────────────────────────────────────────────────────────────────
  {
    _type: 'page',
    title: 'Homepage',
    slug: { _type: 'slug', current: 'home' },
    isHomepage: true,
    seoTitle: 'insidePRO — Film. Brand. Emotion.',
    seoDescription: 'Kreativní a marketingová produkce. Navrhujeme identity, natáčíme filmy, spravujeme komunikaci.',
    blocks: [
      {
        _type: 'heroSection',
        _key: key(),
        headline: 'FROM THE INSIDE',
        subtitle: 'Film. Brand. Emotion.',
        showScrollIndicator: true,
      },
      {
        _type: 'servicesListSection',
        _key: key(),
        label: 'CO DĚLÁME',
        items: [
          { _key: key(), number: '01', title: 'PRODUKCE', description: 'Audiovizuální tvorba od nápadu po výstup. Vytváříme videa, fotografie, obsah pro sociální sítě i kampaně.' },
          { _key: key(), number: '02', title: 'BRANDING', description: 'Identita, kterou poznáte na první pohled. Logo, vizuální systém, kreativní směr a design značky.' },
          { _key: key(), number: '03', title: 'MARKETING', description: 'Strategická komunikace, která dostává značku k lidem. Sociální sítě, kampaně a dlouhodobá viditelnost.' },
        ],
      },
      {
        _type: 'clientsSection',
        _key: key(),
        label: 'NAŠI KLIENTI',
        supportLabel: 'NAŠÍ tvorbu podporují',
        clients: [
          { _key: key(), name: 'FERI' },
          { _key: key(), name: 'ISCARE' },
          { _key: key(), name: 'Kingspan' },
          { _key: key(), name: 'O2' },
        ],
      },
      {
        _type: 'featuredWorksSection',
        _key: key(),
        heading: 'VYBRANÉ PRÁCE',
        showViewAllLink: true,
        viewAllLabel: 'ZOBRAZIT VŠE',
        viewAllSlug: '/prace',
        projects: projectDocs.map(d => ({ _key: key(), ...ref(d._id) })),
      },
      {
        _type: 'ctaSection',
        _key: key(),
        headline: 'MÁTE PROJEKT? POJĎME NA TO',
        buttonLabel: 'KONTAKT',
        buttonLink: '/kontakt',
      },
    ],
  },

  // ── FILMY ────────────────────────────────────────────────────────────────────
  {
    _type: 'page',
    title: 'Filmy',
    slug: { _type: 'slug', current: 'filmy' },
    isHomepage: false,
    seoTitle: 'Filmy — insidePRO',
    seoDescription: 'Celovečerní dokumentární filmy a autorská tvorba insidePRO.',
    blocks: [
      {
        _type: 'heroSection',
        _key: key(),
        headline: 'STORIES WORTH TELLING',
        showScrollIndicator: true,
      },
      {
        _type: 'twoColumnSection',
        _key: key(),
        leftHeading: 'THAT\'S WHY WE MAKE FILMS',
        rightBodyText: 'We don\'t sell content. We deliver emotions. Film je nejsilnější médium pro vyprávění příběhů — a my ho používáme naplno.',
      },
      {
        _type: 'filmShowcaseSection',
        _key: key(),
        label: 'AUTORSKÁ TVORBA',
        heading: 'FILM JE MOCNÝ NÁSTROJ',
        introText: 'Vyrábíme celovečerní dokumentární filmy pro mezinárodní distribuci. Na těchto projektech úzce spolupracujeme s přední filmovou a distribuční společností Analog Vision. V autorské tvorbě se zaměřujeme na sportovní, environmentální a společensky významná témata. Máte příběh, který chcete vyprávět? Ozvěte se nám!',
        films: filmDocs.map(d => ({ _key: key(), ...ref(d._id) })),
      },
      {
        _type: 'featuredWorksSection',
        _key: key(),
        heading: 'NAŠE FILMY',
        showViewAllLink: false,
        projects: projectDocs.map(d => ({ _key: key(), ...ref(d._id) })),
      },
    ],
  },

  // ── PRODUKCE ──────────────────────────────────────────────────────────────────
  {
    _type: 'page',
    title: 'Produkce',
    slug: { _type: 'slug', current: 'produkce' },
    isHomepage: false,
    seoTitle: 'Produkce — insidePRO',
    seoDescription: 'Komerční video produkce, fotografie a obsah pro sociální sítě.',
    blocks: [
      {
        _type: 'heroSection',
        _key: key(),
        headline: 'LET\'S TAKE SOME SHOTS',
        showScrollIndicator: true,
      },
      {
        _type: 'servicesListSection',
        _key: key(),
        label: 'CO DĚLÁME',
        items: [
          { _key: key(), number: '01', title: 'KOMERČNÍ VIDEO', description: 'Reklamní spoty, firemní filmy, produktová videa. Od scénáře přes produkci až po finální střih.' },
          { _key: key(), number: '02', title: 'FOTOGRAFIE', description: 'Korporátní fotografie, produktové snímky, eventová dokumentace a portréty.' },
          { _key: key(), number: '03', title: 'OBSAH PRO SOCIÁLNÍ SÍTĚ', description: 'Pravidelný obsah na míru pro Instagram, LinkedIn a další platformy.' },
        ],
      },
      {
        _type: 'featuredWorksSection',
        _key: key(),
        heading: 'VYBRANÉ PRÁCE',
        showViewAllLink: true,
        viewAllLabel: 'ZOBRAZIT VŠE',
        viewAllSlug: '/prace',
        projects: projectDocs.map(d => ({ _key: key(), ...ref(d._id) })),
      },
      {
        _type: 'ctaSection',
        _key: key(),
        headline: 'MÁTE PROJEKT? POJĎME NA TO',
        buttonLabel: 'KONTAKT',
        buttonLink: '/kontakt',
      },
    ],
  },

  // ── BRANDING ──────────────────────────────────────────────────────────────────
  {
    _type: 'page',
    title: 'Branding',
    slug: { _type: 'slug', current: 'branding' },
    isHomepage: false,
    seoTitle: 'Branding & Identity — insidePRO',
    seoDescription: 'Vizuální identita, weby na míru a branding, který prodává.',
    blocks: [
      {
        _type: 'heroSection',
        _key: key(),
        headline: 'BRANDING AND IDENTITY',
        showScrollIndicator: true,
      },
      {
        _type: 'servicesListSection',
        _key: key(),
        label: 'CO DĚLÁME',
        leftHeading: 'DVĚ DISCIPLÍNY JEDEN JAZYK',
        leftHeadingItalic: 'JEDEN',
        items: [
          { _key: key(), number: '01', title: 'VIZUÁLNÍ IDENTITA', description: 'Logo, barvy, typografie, manuál. Pro firmy, kampaně i eventy. Systém, který roste s vámi.' },
          { _key: key(), number: '02', title: 'WEBY NA MÍRU', description: 'Design a vývoj webů, které prodávají. Ne šablony — každý projekt je originál navržený pro konkrétní cíl.' },
        ],
      },
      {
        _type: 'quoteSection',
        _key: key(),
        largeHeadline: 'VZHLED JE JEN ZAČÁTEK',
        largeHeadlineItalic: 'JEN',
        quoteText: 'Dobrá identita není dekorace. Pomáhá lidem značku poznat, zapamatovat si ji a důvěřovat jí. Vzhled je jen začátek.',
      },
      {
        _type: 'processSection',
        _key: key(),
        label: 'JAK PRACUJEME',
        steps: [
          { _key: key(), number: '01', title: 'ZADÁNÍ', description: 'Kde jste teď a kam chcete jít. Co váš brand říká a co by říkat měl.' },
          { _key: key(), number: '02', title: 'STRATEGIE', description: 'Základ, od kterého se vše odvíjí. Jak váš brand mluví a jak mu rozumí cílové skupiny.' },
          { _key: key(), number: '03', title: 'TVORBA', description: 'Logomanuál, identita, web. Jak váš brand miluje a jak mu rozumí cílové skupiny.' },
          { _key: key(), number: '04', title: 'PŘEDÁNÍ', description: 'Nejsme jenom dodavatelé. Jsme strategický partner v péči o vaši značku.' },
        ],
      },
      {
        _type: 'featuredWorksSection',
        _key: key(),
        heading: 'VYBRANÉ PRÁCE',
        showViewAllLink: true,
        viewAllLabel: 'ZOBRAZIT VŠE',
        viewAllSlug: '/prace',
        projects: projectDocs.filter(d => d.category === 'branding').map(d => ({ _key: key(), ...ref(d._id) })),
      },
    ],
  },

  // ── MARKETING ─────────────────────────────────────────────────────────────────
  {
    _type: 'page',
    title: 'Marketing',
    slug: { _type: 'slug', current: 'marketing' },
    isHomepage: false,
    seoTitle: 'Marketing — insidePRO',
    seoDescription: 'Kampaně, sociální sítě a PPC reklama postavené na strategii.',
    blocks: [
      {
        _type: 'heroSection',
        _key: key(),
        headline: 'CAMPAIGNS BUILT ON STRATEGY',
        showScrollIndicator: true,
      },
      {
        _type: 'servicesListSection',
        _key: key(),
        label: 'CO DĚLÁME',
        items: [
          { _key: key(), number: '01', title: 'SOCIÁLNÍ SÍTĚ', description: 'Správa a tvorba obsahu pro Instagram, Facebook, LinkedIn. Konzistentní hlas značky každý den.' },
          { _key: key(), number: '02', title: 'PPC KAMPANĚ', description: 'Výkonnostní reklama na Google, Meta a dalších platformách. Měřitelné výsledky a průběžná optimalizace.' },
          { _key: key(), number: '03', title: 'CONTENT MARKETING', description: 'Obsahová strategie, která buduje důvěru a přivádí zákazníky organicky.' },
        ],
      },
      {
        _type: 'processSection',
        _key: key(),
        label: 'JAK PRACUJEME',
        steps: [
          { _key: key(), number: '01', title: 'ANALÝZA', description: 'Auditujeme stávající komunikaci a identifikujeme příležitosti pro růst.' },
          { _key: key(), number: '02', title: 'STRATEGIE', description: 'Stavíme plán na základě dat — cílové skupiny, kanály, tóny hlasu.' },
          { _key: key(), number: '03', title: 'TVORBA', description: 'Obsah, kreativa a kampaně, které zaujmou a konvertují.' },
          { _key: key(), number: '04', title: 'OPTIMALIZACE', description: 'Sledujeme výsledky a průběžně upravujeme strategii pro maximální efekt.' },
        ],
      },
      {
        _type: 'featuredWorksSection',
        _key: key(),
        heading: 'VYBRANÉ PRÁCE',
        showViewAllLink: true,
        viewAllLabel: 'ZOBRAZIT VŠE',
        viewAllSlug: '/prace',
        projects: projectDocs.filter(d => d.category === 'marketing').map(d => ({ _key: key(), ...ref(d._id) })),
      },
      {
        _type: 'ctaSection',
        _key: key(),
        headline: 'MÁTE PROJEKT? POJĎME NA TO',
        buttonLabel: 'KONTAKT',
        buttonLink: '/kontakt',
      },
    ],
  },

  // ── KONTAKT ───────────────────────────────────────────────────────────────────
  {
    _type: 'page',
    title: 'Kontakt',
    slug: { _type: 'slug', current: 'kontakt' },
    isHomepage: false,
    seoTitle: 'Kontakt — insidePRO',
    seoDescription: 'Poznejte tým insidePRO. Jsme kreativní a marketingová produkce z Hradce Králové a Prahy.',
    blocks: [
      {
        _type: 'heroSection',
        _key: key(),
        headline: 'THIS IS US',
        showScrollIndicator: false,
      },
      {
        _type: 'twoColumnSection',
        _key: key(),
        leftHeading: 'WE HELP YOU CREATE VISUALS THAT REFLECT YOUR VALUES AND BRAND',
        leftHeadingItalic: 'REFLECT',
        rightBodyText: 'Jsme kreativní a marketingová produkce s více než 18 lety zkušeností. Pomáháme vám tvořit obsah, který lidi osloví, buduje důvěru a prodává. Společně hledáme cestu, jak vaši značku ukázat světu jednoduše a silně. Děláme věci, které fungují.',
      },
      {
        _type: 'twoColumnSection',
        _key: key(),
        label: 'JSME VÍCE NEŽ PRODUKCE',
        leftHeading: 'Navrhujeme identity. Natáčíme filmy. Spravujeme komunikaci.',
        rightBodyText: 'Jedna značka. Jeden tým. Nemusíte koordinovat agenturu, produkci a správu kampaní. Důvěřují nám značky, které nemají prostor pro kompromisy.',
      },
      {
        _type: 'teamSection',
        _key: key(),
        heading: 'NÁŠ TÝM',
        teamMembers: teamDocs.map(d => ({ _key: key(), ...ref(d._id) })),
      },
    ],
  },
]

const pageDocs = await Promise.all(
  pages.map(p => client.create(p))
)
pageDocs.forEach(d => console.log(`  ✓ ${d.title} /${d.slug?.current} (${d._id})`))

// ─── Done ─────────────────────────────────────────────────────────────────────
const allIds = [
  ...teamDocs,
  ...filmDocs,
  ...projectDocs,
  ...pageDocs,
].map(d => d._id)

console.log(`\n✅ Created ${allIds.length} documents total.`)
console.log('   Documents are live — no separate publish step needed.')
console.log('\n   Visit http://localhost:3000 to see the homepage.')
console.log('   Visit http://localhost:3000/studio to manage content.')
