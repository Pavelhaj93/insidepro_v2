/**
 * One-time migration — converts featureCard.bullets to an array of bullet objects,
 * each with its own Portable Text `text` field (lead term marked "gold", rest white).
 * Handles both original string bullets and interim bare-block bullets.
 * Idempotent: bullets that are already bullet objects are skipped.
 * Run: node --env-file=.env.local scripts/migrate-feature-card-bullets.mjs
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
  perspective: 'raw',
})

const key = () => randomUUID().replace(/-/g, '').substring(0, 12)

// Gold term → white description splits for the existing content.
// Keyed by whitespace-normalized original string.
const SPLITS = {
  'Logotypy a značky jedinečný základ pro rozpoznatelnost vaší značky':
    ['Logotypy a značky', 'jedinečný základ pro rozpoznatelnost vaší značky'],
  'Barevnost a typografie vizuální jazyk, který definuje charakter značky':
    ['Barevnost a typografie', 'vizuální jazyk, který definuje charakter značky'],
  'Brand manuály jasná pravidla pro konzistentní používání identity':
    ['Brand manuály', 'jasná pravidla pro konzistentní používání identity'],
  'Kompletní vizuální identity od prvního návrhu po ucelený vizuální ekosystém':
    ['Kompletní vizuální identity', 'od prvního návrhu po ucelený vizuální ekosystém'],
  'Redesign a refresh modernizace značek bez ztráty jejich charakteru':
    ['Redesign a refresh', 'modernizace značek bez ztráty jejich charakteru'],
  'Sjednocení komunikace propojení všech vizuálních výstupů do jednoho celku':
    ['Sjednocení komunikace', 'propojení všech vizuálních výstupů do jednoho celku'],
  'Tiskoviny a katalogy profesionální materiály pro prezentaci značky':
    ['Tiskoviny a katalogy', 'profesionální materiály pro prezentaci značky'],
  'Online a offline vizuály grafické výstupy napříč všemi kanály':
    ['Online a offline vizuály', 'grafické výstupy napříč všemi kanály'],
  'Prezentace a firemní materiály vizuálně sjednocené podklady pro obchod i komunikaci':
    ['Prezentace a firemní materiály', 'vizuálně sjednocené podklady pro obchod i komunikaci'],
  'UX/UI návrh a wireframy struktura a design zaměřený na uživatele':
    ['UX/UI návrh a wireframy', 'struktura a design zaměřený na uživatele'],
  'Webdesign na míru vizuální podoba webu přizpůsobená vaší značce':
    ['Webdesign na míru', 'vizuální podoba webu přizpůsobená vaší značce'],
  'Landing pages efektivní stránky pro kampaně a výkon':
    ['Landing pages', 'efektivní stránky pro kampaně a výkon'],
  'Weby na míru responzivní weby postavené na vašich potřebách':
    ['Weby na míru', 'responzivní weby postavené na vašich potřebách'],
  'E-shopy na míru konverzně optimalizované online prodeje':
    ['E-shopy na míru', 'konverzně optimalizované online prodeje'],
  'Webové aplikace nástroje pro zjednodušení a automatizaci procesů':
    ['Webové aplikace', 'nástroje pro zjednodušení a automatizaci procesů'],
  'Programování & CMS (Sanity a další) – technická realizace řešení':
    ['Programování & CMS (Sanity a další)', 'technická realizace řešení'],
  'SEO optimalizace zlepšení viditelnosti ve vyhledávačích':
    ['SEO optimalizace', 'zlepšení viditelnosti ve vyhledávačích'],
  'Správa a podpora dlouhodobá péče a rozvoj webu':
    ['Správa a podpora', 'dlouhodobá péče a rozvoj webu'],
}

const normalize = s => s.replace(/\s+/g, ' ').trim()

const span = (text, marks = []) => ({ _type: 'span', _key: key(), text, marks })

function toBlock(bullet) {
  const split = SPLITS[normalize(bullet)]
  const children = split
    ? [span(split[0], ['gold']), span(' ' + split[1])]
    : [span(normalize(bullet))]
  if (!split) console.warn(`  ⚠ no split mapping — migrated as plain white text: "${bullet}"`)
  return { _type: 'block', _key: key(), style: 'normal', markDefs: [], children }
}

function toBulletObject(item) {
  if (typeof item === 'string') return { _type: 'bullet', _key: key(), text: [toBlock(item)] }
  if (item._type === 'block') return { _type: 'bullet', _key: key(), text: [item] }
  return item // already a bullet object
}

const pages = await client.fetch(
  `*[_type == 'page' && count(blocks[_type == 'featureCardsSection']) > 0]{
    _id, title,
    'sections': blocks[_type == 'featureCardsSection']{ _key, cards[]{ _key, title, bullets } }
  }`
)

if (!pages.length) {
  console.log('No pages with featureCardsSection found — nothing to migrate.')
  process.exit(0)
}

for (const page of pages) {
  console.log(`\n📄 ${page._id} (${page.title ?? 'untitled'})`)
  let patch = client.patch(page._id)
  let changes = 0

  for (const section of page.sections ?? []) {
    for (const card of section.cards ?? []) {
      const bullets = card.bullets ?? []
      const needsMigration = bullets.some(b => typeof b === 'string' || b._type === 'block')
      if (!needsMigration) {
        console.log(`  ↷ ${card.title}: already migrated or empty, skipping`)
        continue
      }
      const path = `blocks[_key=="${section._key}"].cards[_key=="${card._key}"].bullets`
      patch = patch.set({ [path]: bullets.map(toBulletObject) })
      changes++
      console.log(`  ✓ ${card.title}: ${bullets.length} bullet(s) converted`)
    }
  }

  if (changes) {
    await patch.commit()
    console.log(`  💾 committed ${changes} card(s)`)
  }
}

console.log('\nDone.')
