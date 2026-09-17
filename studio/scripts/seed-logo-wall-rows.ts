// One-off content seed: run with
//   npx sanity exec scripts/seed-logo-wall-rows.ts --with-user-token
// from the studio/ directory. Creates the handful of missing `brandLogo`
// placeholder documents (name only, no image yet — upload those in Studio),
// then splits the homepage's existing `logoWallSection` block's logos into
// the two explicit editorial rows requested, in the given order.
import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2024-01-01' })

function randomKey(length = 12) {
  return Math.random().toString(36).slice(2, 2 + length)
}

// Maps each requested name to an existing brandLogo document's _id (matched
// by the closest existing name/spelling already in the dataset) or to a
// placeholder id for a brand new (image-less) document created below.
const TOP_ROW = [
  { name: 'Vodafone', id: 'brandLogo-59ed7aa4b515' },
  { name: 'Kingspan', id: 'brandLogo-2c600f151e38' }, // existing "Kingspan | GOAL" combined logo
  { name: 'Goal', id: 'brandLogo-goal-placeholder' },
  { name: 'ISCARE', id: 'brandLogo-db801ed95ade' },
  { name: 'Česká Televize', id: 'brandLogo-14d417453ca8' },
  { name: 'Central Pool', id: 'brandLogo-5ac8522ca07a' },
  { name: 'Vidia Diagnostika', id: 'brandLogo-99910c00adef' },
  { name: 'Heli Czech', id: 'brandLogo-838a91950d87' }, // existing "Heliczech"
  { name: 'Tip Sport', id: 'brandLogo-9a2a994fbcbe' }, // existing "Tipsport"
  { name: 'Generaly', id: 'brandLogo-da57740eb43c' }, // existing "Generali"
  { name: 'Samsung', id: 'brandLogo-35c45387276c' },
  { name: 'Medifree', id: 'brandLogo-588e81933c5e' },
  { name: 'David Dvořák', id: 'brandLogo-28b793c22c52' }, // existing "David Dvořák Undertaker"
  { name: 'Prima Cool', id: 'bfb6d987-c702-4f53-9fe0-48dd8e6b51f4' },
]

const BOTTOM_ROW = [
  { name: 'Kofola', id: 'brandLogo-kofola-placeholder' },
  { name: 'Koupelny Syrový', id: 'brandLogo-5902d997787a' },
  { name: 'Redbull', id: 'brandLogo-7e53f220a57b' }, // existing "Red Bull"
  { name: 'Kaufland', id: 'brandLogo-10eac072f5df' },
  { name: 'KIK', id: 'brandLogo-2591f3cc2f62' }, // existing "kik"
  { name: 'Solight', id: 'brandLogo-264d929bd39f' },
  { name: 'Camel', id: 'brandLogo-0bf80f7d818a' },
  { name: 'mBank', id: 'brandLogo-6e9ee068519a' },
  { name: 'Pitbull', id: 'brandLogo-50d9432b9678' }, // existing "Pitbull West Coast"
  { name: 'Sony', id: 'brandLogo-b1d672553604' },
  { name: 'One Man Show', id: 'brandLogo-one-man-show-placeholder' },
  { name: 'Analog Vision', id: 'brandLogo-7aade2c0c034' },
  { name: 'NUDZ', id: 'brandLogo-452f440fab6f' }, // existing "NUDZ – Národní ústav duševního zdraví"
  { name: 'Škoda Motor Sport', id: 'brandLogo-9e475364ef43' }, // existing "Škoda Motorsport"
  { name: 'Central Plast', id: 'brandLogo-20a0defd80e5' }, // existing "Centralplast"
  { name: 'Život Postaru', id: 'brandLogo-8e09dc330f3d' },
]

// Only these three don't exist yet anywhere in the dataset — created as
// name-only placeholders (the marquee skips any brandLogo with no image, so
// they'll just stay invisible until a real logo file is uploaded to them).
const PLACEHOLDERS_TO_CREATE = [
  { _id: 'brandLogo-goal-placeholder', name: 'Goal' },
  { _id: 'brandLogo-kofola-placeholder', name: 'Kofola' },
  { _id: 'brandLogo-one-man-show-placeholder', name: 'One Man Show' },
]

async function main() {
  for (const doc of PLACEHOLDERS_TO_CREATE) {
    await client.createIfNotExists({ _type: 'brandLogo', ...doc })
    console.log(`Ensured placeholder brandLogo: ${doc.name} (${doc._id})`)
  }

  const homepage = await client.fetch<{ _id: string; blocks?: Array<Record<string, unknown>> }>(
    `*[_type == "page" && isHomepage == true][0]{ _id, blocks }`,
  )
  if (!homepage) throw new Error('No homepage document found.')

  const blocks = homepage.blocks ?? []
  const logoWallIndex = blocks.findIndex((b) => b._type === 'logoWallSection')
  if (logoWallIndex === -1) throw new Error('No logoWallSection block found on the homepage.')

  const existingBlock = blocks[logoWallIndex] as Record<string, unknown>
  const updatedBlock = {
    ...existingBlock,
    topRowLogos: TOP_ROW.map((logo) => ({
      _type: 'reference',
      _key: randomKey(),
      _ref: logo.id,
    })),
    bottomRowLogos: BOTTOM_ROW.map((logo) => ({
      _type: 'reference',
      _key: randomKey(),
      _ref: logo.id,
    })),
  }
  delete (updatedBlock as { logos?: unknown }).logos

  const newBlocks = [...blocks]
  newBlocks[logoWallIndex] = updatedBlock

  await client.patch(homepage._id).set({ blocks: newBlocks }).commit()
  console.log(
    `Updated logoWallSection block: ${TOP_ROW.length} top-row logos, ${BOTTOM_ROW.length} bottom-row logos.`,
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
