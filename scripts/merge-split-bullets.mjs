/**
 * One-off fix — merges bullet pairs that were split by Enter in the interim editor:
 * a bullet containing only gold text followed by a bullet containing only white text
 * becomes a single bullet (gold term + white description).
 * Run: node --env-file=.env.local scripts/merge-split-bullets.mjs
 */

import { createClient } from '@sanity/client'

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
  perspective: 'raw',
})

const spansOf = bullet => (bullet.text ?? []).flatMap(b => b.children ?? [])
const isGoldOnly = bullet =>
  spansOf(bullet).every(s => s.marks?.includes('gold') || !s.text.trim()) &&
  spansOf(bullet).some(s => s.marks?.includes('gold'))
const isWhiteOnly = bullet =>
  spansOf(bullet).length > 0 && spansOf(bullet).every(s => !(s.marks ?? []).length)
const plainText = bullet => spansOf(bullet).map(s => s.text).join('')

function mergePairs(bullets) {
  const merged = []
  let didMerge = false
  for (let i = 0; i < bullets.length; i++) {
    const current = bullets[i]
    const next = bullets[i + 1]
    if (next && isGoldOnly(current) && isWhiteOnly(next)) {
      const goldText = plainText(current).trim()
      const whiteText = plainText(next).trim()
      const block = current.text[0]
      merged.push({
        ...current,
        text: [
          {
            ...block,
            children: [
              { ...block.children.find(s => s.marks?.includes('gold')), text: goldText },
              { _type: 'span', _key: next._key, text: ' ' + whiteText, marks: [] },
            ],
          },
        ],
      })
      console.log(`    merged: "${goldText}" + "${whiteText}"`)
      didMerge = true
      i++ // skip the white bullet we just consumed
    } else {
      merged.push(current)
    }
  }
  return didMerge ? merged : null
}

const pages = await client.fetch(
  `*[_type == 'page' && count(blocks[_type == 'featureCardsSection']) > 0]{
    _id, title,
    'sections': blocks[_type == 'featureCardsSection']{ _key, cards[]{ _key, title, bullets } }
  }`
)

for (const page of pages) {
  console.log(`\n📄 ${page._id} (${page.title ?? 'untitled'})`)
  let patch = client.patch(page._id)
  let changes = 0

  for (const section of page.sections ?? []) {
    for (const card of section.cards ?? []) {
      console.log(`  ${card.title}:`)
      const merged = mergePairs(card.bullets ?? [])
      if (!merged) {
        console.log('    nothing to merge')
        continue
      }
      const path = `blocks[_key=="${section._key}"].cards[_key=="${card._key}"].bullets`
      patch = patch.set({ [path]: merged })
      changes++
    }
  }

  if (changes) {
    await patch.commit()
    console.log(`  💾 committed ${changes} card(s)`)
  }
}

console.log('\nDone.')
