/**
 * One-off content change for the "Timecode / Střih" contact form (2026-10-18):
 * - homepage: appends a contactFormSection (sits right above the footer) and
 *   points the split video reveal CTA at it (`#kontakt`)
 * - /kontakt: replaces the trailing ctaSection (it linked to /kontakt itself)
 *   with a contactFormSection
 * Patches the published document and its draft, if one exists. Idempotent —
 * pages that already have a contactFormSection are skipped.
 * Run: node --env-file=.env.local scripts/add-contact-form-blocks.mjs [--dry-run]
 */

import { randomUUID } from 'node:crypto'
import { createClient } from '@sanity/client'

const token = process.env.SANITY_API_WRITE_TOKEN
if (!token) {
  console.error('Missing SANITY_API_WRITE_TOKEN in .env.local')
  process.exit(1)
}

const dryRun = process.argv.includes('--dry-run')

const client = createClient({
  projectId: '4mvdpq34',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
  perspective: 'raw',
})

const contactBlock = () => ({
  _type: 'contactFormSection',
  _key: randomUUID().replaceAll('-', '').slice(0, 12),
  headingLine1: 'Řekněte nám',
  headingLine2: 'o svém projektu',
  introText: 'Pár řádků stačí. Ozveme se vám do dvou pracovních dnů.',
  successMessage: 'Ozveme se vám co nejdřív zpátky.',
})

const docs = await client.fetch(
  `*[_type == "page" && (isHomepage == true || slug.current == "kontakt")]{
    _id, title, isHomepage, "blocks": blocks[]{_key, _type}
  }`,
)

const tx = client.transaction()
for (const doc of docs) {
  const types = (doc.blocks ?? []).map((b) => b._type)
  if (types.includes('contactFormSection')) {
    console.log(`skip ${doc._id} (${doc.title}): already has a contact form`)
    continue
  }

  if (doc.isHomepage) {
    const split = doc.blocks.find((b) => b._type === 'splitVideoRevealSection')
    let patch = client.patch(doc._id).insert('after', 'blocks[-1]', [contactBlock()])
    if (split) patch = patch.set({ [`blocks[_key=="${split._key}"].buttonLink`]: '#kontakt' })
    tx.patch(patch)
    console.log(`${doc._id} (${doc.title}): + contact form at the end${split ? ', CTA → #kontakt' : ''}`)
  } else {
    const cta = doc.blocks?.findLast((b) => b._type === 'ctaSection')
    const patch = cta
      ? client.patch(doc._id).insert('replace', `blocks[_key=="${cta._key}"]`, [contactBlock()])
      : client.patch(doc._id).insert('after', 'blocks[-1]', [contactBlock()])
    tx.patch(patch)
    console.log(`${doc._id} (${doc.title}): ${cta ? 'ctaSection → contact form' : '+ contact form at the end'}`)
  }
}

if (dryRun) {
  console.log('\n--dry-run: nothing written')
  console.log(JSON.stringify(tx.serialize(), null, 2))
} else {
  const res = await tx.commit()
  console.log(`\ndone, transaction ${res.transactionId}`)
}
