// One-off content seed: run with
//   npx sanity exec scripts/seed-homepage-page-builder-blocks.ts --with-user-token
// from the studio/ directory. Populates the homepage `page` document's
// `blocks` array with the sections that used to be hardcoded in
// `src/app/page.tsx` (hero, services accordion, "who we are", zoom text,
// team), and flips the existing clientsSection/logoWallSection blocks to
// their homepage `layout` variant. Safe to re-run — it always replaces the
// full `blocks` array with a freshly built one.
import fs from 'node:fs'
import path from 'node:path'
import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2024-01-01' })

function randomKey(length = 12) {
  return Math.random().toString(36).slice(2, 2 + length)
}

function pt(text: string, markedSubstring?: string, mark?: 'em' | 'strong' | 'gold') {
  if (!markedSubstring || !mark) {
    return [
      {
        _type: 'block',
        _key: randomKey(),
        style: 'normal',
        markDefs: [],
        children: [{ _type: 'span', _key: randomKey(), text, marks: [] }],
      },
    ]
  }
  const idx = text.indexOf(markedSubstring)
  if (idx === -1) return pt(text)
  const before = text.slice(0, idx)
  const after = text.slice(idx + markedSubstring.length)
  return [
    {
      _type: 'block',
      _key: randomKey(),
      style: 'normal',
      markDefs: [],
      children: [
        ...(before ? [{ _type: 'span', _key: randomKey(), text: before, marks: [] }] : []),
        { _type: 'span', _key: randomKey(), text: markedSubstring, marks: [mark] },
        ...(after ? [{ _type: 'span', _key: randomKey(), text: after, marks: [] }] : []),
      ],
    },
  ]
}

// The hero video was already uploaded to the dataset (it's the literal
// `HERO_VIDEO_SRC` constant that used to live in `src/app/page.tsx`) — this
// references that existing file asset instead of re-uploading it.
const HERO_VIDEO_ASSET_ID = 'file-bf7a1ec8045d083288c54c2fda0ac1a90c39b733-mp4'

// The photos WhoWeAreSection used as static placeholders, at
// `insidepro_v2/public/images/`.
const PUBLIC_IMAGES_DIR = path.resolve(__dirname, '../../public/images')

const SERVICES = [
  {
    number: '01',
    title: 'Produkce',
    subtitle: 'Video & foto',
    description:
      'Od prvního námětu po finální výstup. Zajišťujeme kompletní video a fotoprodukci včetně přípravy, natáčení a postprodukce.',
    keywords: [
      'Reklamní spoty',
      'Brandová videa',
      'Produktová videa',
      'Foto produkce',
      'Content',
      'Postprodukce',
      'Motion & 3D',
    ],
  },
  {
    number: '02',
    title: 'Branding',
    subtitle: 'Identita',
    description:
      'Tvoříme vizuální identity, které dávají značce jasný charakter a drží pohromadě napříč celou komunikací.',
    keywords: ['Logo design', 'Vizuální identita', 'Brand manuály', 'Grafický design', 'Kampaně', 'Firemní materiály'],
  },
  {
    number: '03',
    title: 'Weby',
    subtitle: 'Design & Development',
    description:
      'Navrhujeme a vyvíjíme weby na míru. Od UX a vizuálního návrhu přes vývoj až po obsah, SEO a dlouhodobou správu.',
    keywords: ['UX/UI design', 'Web development', 'E-shopy', 'SEO', 'Webová analytika', 'Správa & rozvoj'],
  },
  {
    number: '04',
    title: 'Marketing',
    subtitle: 'Strategie & kampaně',
    description:
      'Stavíme marketing jako jeden funkční systém. Propojujeme strategii, obsah, kampaně a výkon a dlouhodobě řídíme jejich výsledky.',
    keywords: ['Strategie', 'PPC kampaně', 'Social media', 'Content marketing', 'Správa kampaní', 'Reporting & optimalizace'],
  },
  {
    number: '05',
    title: 'Filmy',
    subtitle: 'Příběhy',
    description:
      'Vyvíjíme a natáčíme autorské dokumentární a celovečerní projekty určené pro domácí i mezinárodní distribuci.',
    keywords: ['Dokumentární filmy', 'Seriály', 'Vývoj & scénář', 'Mezinárodní produkce', 'Distribuce'],
  },
]

async function uploadImage(filename: string) {
  const filePath = path.join(PUBLIC_IMAGES_DIR, filename)
  if (!fs.existsSync(filePath)) {
    console.warn(`Missing ${filePath}, skipping.`)
    return null
  }
  const asset = await client.assets.upload('image', fs.createReadStream(filePath), { filename })
  return { _type: 'image' as const, asset: { _type: 'reference' as const, _ref: asset._id } }
}

async function main() {
  const homepage = await client.fetch<{ _id: string; blocks?: Array<Record<string, unknown>> }>(
    `*[_type == "page" && isHomepage == true][0]{ _id, blocks }`,
  )
  if (!homepage) {
    throw new Error('No page document with isHomepage == true found. Create/mark the homepage in Studio first.')
  }

  const existingBlocks = homepage.blocks ?? []
  const existingLogoWall = existingBlocks.find((b) => b._type === 'logoWallSection')
  const existingClients = existingBlocks.find((b) => b._type === 'clientsSection')

  if (!existingLogoWall) {
    console.warn('No existing "logoWallSection" block found on the homepage — the logo marquee will be skipped.')
  }
  if (!existingClients) {
    console.warn('No existing "clientsSection" block found on the homepage — the client showcase will be skipped.')
  }

  const teamMembers = await client.fetch<Array<{ _id: string }>>(
    `*[_type == "teamMember"] | order(order asc) { _id }`,
  )
  const teamMemberIds = teamMembers.map((member) => member._id)

  const leftPhotoFiles = [
    'left_image.png',
    'left_image-2.jpg',
    'left_image-3.jpg',
    'left_image-4.jpg',
    'left_image-5.jpg',
  ]
  const leftPhotos = (await Promise.all(leftPhotoFiles.map(uploadImage)))
    .filter((image): image is NonNullable<typeof image> => Boolean(image))
    .map((image) => ({ ...image, _key: randomKey() }))
  const rightImage = await uploadImage('right_image.png')

  const splitVideoRevealSection = {
    _type: 'splitVideoRevealSection',
    _key: randomKey(),
    kicker: '{ Film. Brand. Emotion. }',
    headline: pt('From the inside', 'the', 'em'),
    subtitle: 'Jsme váš dlouhodobý produkční a kreativní partner',
    cornerHeadline: pt('Tvoříme věci, které inspirují'),
    video: { _type: 'file', asset: { _type: 'reference', _ref: HERO_VIDEO_ASSET_ID } },
  }

  const servicesAccordionSection = {
    _type: 'servicesAccordionSection',
    _key: randomKey(),
    label: '{ Naše služby }',
    heading: pt('Co pro vás můžeme udělat'),
    items: SERVICES.map((service) => ({
      _type: 'serviceItem',
      _key: randomKey(),
      number: service.number,
      title: service.title,
      subtitle: service.subtitle,
      description: pt(service.description),
      keywords: service.keywords,
    })),
  }

  const whoWeAreSection = {
    _type: 'whoWeAreSection',
    _key: randomKey(),
    eyebrow: '{ Kdo jsme }',
    heading: pt('Jsme přední kreativní produkční agentura'),
    missionText:
      'Pomáháme firmám růst prostřednictvím strategie, kreativity a kvalitního obsahu. Propojujeme produkci, branding a marketing do jednoho funkčního celku, který dává značkám jasný směr a podporuje jejich dlouhodobý růst.',
    leftPhotos,
    rightImage,
    badgeText: 'TVOŘÍME • KREATIVITU • EMOCE • PŘÍBĚHY • ',
  }

  const zoomTextSection = {
    _type: 'zoomTextSection',
    _key: randomKey(),
    headline: 'PŘÍBĚH KTERÝ VÁS POHLTÍ',
    accentColor: 'var(--color-brand-light)',
    anchorIndex: 8,
  }

  const teamSection = {
    _type: 'teamSection',
    _key: randomKey(),
    eyebrow: '{ Meet Our Team }',
    heading: 'PO CELOU DOBU SPOLUPRÁCE JSME TU S VÁMI',
    teamMembers: teamMemberIds.map((id) => ({ _type: 'reference', _key: randomKey(), _ref: id })),
    lightBackground: true,
  }

  const patchedLogoWall = existingLogoWall ? { ...existingLogoWall, layout: 'marquee' } : null
  const patchedClients = existingClients ? { ...existingClients, layout: 'horizontalScroll' } : null

  const newBlocks = [
    splitVideoRevealSection,
    servicesAccordionSection,
    whoWeAreSection,
    patchedLogoWall,
    patchedClients,
    zoomTextSection,
    teamSection,
  ].filter(Boolean)

  await client.patch(homepage._id).set({ blocks: newBlocks }).commit()
  console.log(`Seeded ${newBlocks.length} blocks onto homepage document ${homepage._id}.`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
