/**
 * One-time migration — moves every video from Sanity file assets to Mux.
 *
 * - `video` documents: `file` → new `muxVideo`
 * - page blocks: heroSection `backgroundVideo(Mobile)` → `backgroundMuxVideo(Mobile)`,
 *   splitVideoRevealSection `video` / `mobileVideo` → `muxVideo` / `mobileMuxVideo`
 * - categories with only the legacy `video` file: copied into a new `video` document,
 *   which is then set as the category's `featuredVideo`
 *
 * Source per video: with `--originals=<dir>` (repeatable), the uncompressed original is uploaded
 * from disk when one is found — same file name minus the "Komprese - " prefix, any extension,
 * and the same duration (±0.2 s). Otherwise Mux ingests the existing cdn.sanity.io URL.
 * One source file = one Mux asset, however many fields use it. Legacy fields are left
 * untouched, so the currently deployed site keeps playing from Sanity until the new frontend
 * ships. Idempotent: fields already pointing at a real (non-test) Mux asset are skipped, and an
 * interrupted run reuses the Mux assets it already created (matched by `passthrough`). Test
 * assets are never reused — they get replaced. Needs `ffprobe` and `curl` on PATH.
 *
 * Run: node --env-file=.env.local scripts/migrate-videos-to-mux.mjs --dry-run [--originals=<dir> ...]
 *      node --env-file=.env.local scripts/migrate-videos-to-mux.mjs [--originals=<dir> ...]
 */

import { createClient } from '@sanity/client'
import Mux from '@mux/mux-node'
import { execFileSync } from 'child_process'
import { readdirSync, statSync } from 'fs'
import { extname, join, parse, relative } from 'path'

const DRY_RUN = process.argv.includes('--dry-run')
const ORIGINALS_DIRS = process.argv.filter((a) => a.startsWith('--originals=')).map((a) => a.slice('--originals='.length))
const POLL_INTERVAL_MS = 10_000
const POLL_TIMEOUT_MS = 45 * 60_000
const VIDEO_EXT = new Set(['.mp4', '.mov', '.m4v'])
const COMPRESSED_PREFIX = 'Komprese - '

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

const BLOCK_FIELDS = {
  heroSection: [
    ['backgroundVideo', 'backgroundMuxVideo'],
    ['backgroundVideoMobile', 'backgroundMuxVideoMobile'],
  ],
  splitVideoRevealSection: [
    ['video', 'muxVideo'],
    ['mobileVideo', 'mobileMuxVideo'],
  ],
}

const fileProjection = `{ "assetId": asset._ref, "url": asset->url, "filename": asset->originalFilename }`

// A Mux account without a payment method silently turns every asset into a test asset
// (10 s, watermarked, deleted after 24 h) — those fields count as not migrated.
const migrated = (field) => `(defined(${field}.asset) && ${field}.asset->data.test != true)`

// ─── Collect everything that needs a Mux asset ──────────────────────────────

/** Each target = one field on one document that should point at a Mux asset. */
const targets = []

const videoDocs = await client.fetch(
  `*[_type == "video" && defined(file.asset) && !${migrated('muxVideo')}] {
    _id, title, "file": file ${fileProjection}
  }`,
)
for (const doc of videoDocs) {
  targets.push({ kind: 'videoDoc', docId: doc._id, label: `video "${doc.title}"`, path: 'muxVideo', source: doc.file })
}

const pages = await client.fetch(
  `*[_type == "page" && count(blocks[_type in ["heroSection", "splitVideoRevealSection"]]) > 0] {
    _id, title,
    "blocks": blocks[_type in ["heroSection", "splitVideoRevealSection"]] {
      _key, _type,
      "backgroundVideo": backgroundVideo ${fileProjection},
      "backgroundVideoMobile": backgroundVideoMobile ${fileProjection},
      "video": video ${fileProjection},
      "mobileVideo": mobileVideo ${fileProjection},
      "backgroundMuxVideo": ${migrated('backgroundMuxVideo')},
      "backgroundMuxVideoMobile": ${migrated('backgroundMuxVideoMobile')},
      "muxVideo": ${migrated('muxVideo')},
      "mobileMuxVideo": ${migrated('mobileMuxVideo')}
    }
  }`,
)
for (const page of pages) {
  for (const block of page.blocks) {
    for (const [oldField, newField] of BLOCK_FIELDS[block._type]) {
      const source = block[oldField]
      if (!source?.assetId || block[newField]) continue
      targets.push({
        kind: 'block',
        docId: page._id,
        label: `page "${page.title}" → ${block._type}.${newField}`,
        path: `blocks[_key=="${block._key}"].${newField}`,
        source,
      })
    }
  }
}

const categories = await client.fetch(
  `*[_type == "category" && defined(video.asset) && !defined(featuredVideo)] {
    _id, title, "file": video ${fileProjection}, "fileRef": video
  }`,
)
for (const category of categories) {
  targets.push({
    kind: 'category',
    docId: category._id,
    label: `category "${category.title}" → new video doc + featuredVideo`,
    source: category.file,
    category,
  })
}

if (!targets.length) {
  console.log('Nothing to migrate.')
  process.exit(0)
}

// ─── Pick the best source per file (local original or Sanity URL) ───────────

const durationOf = (pathOrUrl) =>
  Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', pathOrUrl], { encoding: 'utf8' }))

const baseName = (filename) => parse(filename).name.replace(COMPRESSED_PREFIX, '').trim().toLowerCase()

const localOriginals = []
const walk = (dir) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) walk(path)
    else if (VIDEO_EXT.has(extname(entry.name).toLowerCase()) && !entry.name.startsWith(COMPRESSED_PREFIX)) {
      localOriginals.push({ path, base: baseName(entry.name), size: statSync(path).size })
    }
  }
}
ORIGINALS_DIRS.forEach(walk)

// Hero / split-reveal blocks are muted loops played as a static MP4 on every page view —
// cap them at 1080p so `highest.mp4` isn't a ~20 Mbit/s 4K file. Library videos stay 4K.
const sources = new Map() // Sanity file asset id → { url, filename, loop, local, key }
for (const t of targets) {
  const existing = sources.get(t.source.assetId)
  if (existing) {
    existing.loop ||= t.kind === 'block'
    continue
  }
  let local
  const candidates = localOriginals.filter((f) => f.base === baseName(t.source.filename ?? ''))
  if (candidates.length) {
    const duration = durationOf(t.source.url)
    local = candidates.find((f) => Math.abs((f.duration ??= durationOf(f.path)) - duration) <= 0.2)
  }
  const key = local ? `local:${local.base}:${Math.round(local.duration * 10)}` : t.source.assetId
  sources.set(t.source.assetId, { ...t.source, loop: t.kind === 'block', local, key })
}

// One Mux asset per unique source; URL ingests first so a test-mode account fails fast,
// then local uploads smallest first.
const units = new Map() // key → { key, url, local, filename, loop }
for (const s of sources.values()) {
  const unit = units.get(s.key)
  if (unit) unit.loop ||= s.loop
  else units.set(s.key, { key: s.key, url: s.url, local: s.local, filename: s.local ? parse(s.local.path).base : s.filename, loop: s.loop })
}
const queue = [...units.values()].sort((a, b) => (a.local?.size ?? -1) - (b.local?.size ?? -1))

const mb = (bytes) => `${Math.round(bytes / 1e6)} MB`
console.log(`\n${DRY_RUN ? '[DRY RUN] ' : ''}${targets.length} field(s) to migrate → ${units.size} Mux asset(s)\n`)
console.table(
  queue.map((u) => ({
    file: u.filename.slice(0, 44),
    source: u.local ? `disk: ${relative(ORIGINALS_DIRS.find((d) => u.local.path.startsWith(d)) ?? '', u.local.path).slice(0, 60)}` : 'Sanity CDN',
    size: u.local ? mb(u.local.size) : '—',
    maxRes: u.loop ? '1080p' : '2160p',
    usedBy: [...sources.values()].filter((s) => s.key === u.key).length + ' file(s)',
  })),
)
console.log(`Upload from disk: ${mb(queue.reduce((sum, u) => sum + (u.local?.size ?? 0), 0))}`)

if (DRY_RUN) {
  console.log('\nThe Mux account needs a payment method — without one Mux creates only test assets (10 s, watermarked, deleted after 24 h).')
  process.exit(0)
}

// ─── Create (or reuse) Mux assets ───────────────────────────────────────────

if (!process.env.MUX_TOKEN_ID || !process.env.MUX_TOKEN_SECRET) {
  console.error('Missing MUX_TOKEN_ID / MUX_TOKEN_SECRET in .env.local')
  process.exit(1)
}
const mux = new Mux({ tokenId: process.env.MUX_TOKEN_ID, tokenSecret: process.env.MUX_TOKEN_SECRET })

const existingByPassthrough = new Map()
for await (const asset of mux.video.assets.list({ limit: 100 })) {
  if (asset.passthrough && asset.status !== 'errored' && !asset.test) existingByPassthrough.set(asset.passthrough, asset)
}

async function uploadFromDisk(unit, settings) {
  const upload = await mux.video.uploads.create({ cors_origin: '*', new_asset_settings: settings })
  const started = Date.now()
  console.log(`⇡ uploading ${unit.filename} (${mb(unit.local.size)})…`)
  execFileSync('curl', ['--fail', '--silent', '--show-error', '-X', 'PUT', '-T', unit.local.path, upload.url])
  console.log(`  uploaded in ${Math.round((Date.now() - started) / 1000)} s`)
  for (;;) {
    const u = await mux.video.uploads.retrieve(upload.id)
    if (u.asset_id) return mux.video.assets.retrieve(u.asset_id)
    if (['errored', 'cancelled', 'timed_out'].includes(u.status)) throw new Error(`Mux upload ${u.status}: ${unit.filename}`)
    await new Promise((r) => setTimeout(r, 3_000))
  }
}

const muxAssetIds = new Map() // unit key → Mux asset id
for (const unit of queue) {
  const existing = existingByPassthrough.get(unit.key)
  if (existing) {
    console.log(`↷ reusing Mux asset ${existing.id} for ${unit.filename}`)
    muxAssetIds.set(unit.key, existing.id)
    continue
  }
  const settings = {
    playback_policies: ['public'],
    video_quality: 'basic',
    max_resolution_tier: unit.loop ? '1080p' : '2160p',
    static_renditions: [{ resolution: 'highest' }],
    passthrough: unit.key,
    meta: { title: unit.filename },
  }
  const asset = unit.local
    ? await uploadFromDisk(unit, settings)
    : await mux.video.assets.create({ inputs: [{ url: unit.url }], ...settings })
  if (asset.test) {
    await mux.video.assets.delete(asset.id)
    console.error(
      '\n✗ Mux created a TEST asset (10 s, watermarked, deleted after 24 h) — the account has no payment method.' +
        '\n  Add one in the Mux dashboard (Settings → Billing) and re-run. Nothing was written to Sanity.',
    )
    process.exit(1)
  }
  console.log(`＋ created Mux asset ${asset.id} for ${unit.filename}`)
  muxAssetIds.set(unit.key, asset.id)
}

// ─── Wait until playback + static MP4 are ready ─────────────────────────────

const isSettled = (asset) =>
  asset.status === 'errored' ||
  (asset.status === 'ready' &&
    (asset.static_renditions?.files ?? []).every((f) => ['ready', 'skipped', 'errored'].includes(f.status)))

const readyAssets = new Map() // unit key → settled Mux asset
const deadline = Date.now() + POLL_TIMEOUT_MS
console.log('\n⏳ waiting for Mux to finish encoding…')
while (readyAssets.size < muxAssetIds.size) {
  for (const [key, muxAssetId] of muxAssetIds) {
    if (readyAssets.has(key)) continue
    const asset = await mux.video.assets.retrieve(muxAssetId)
    if (!isSettled(asset)) continue
    readyAssets.set(key, asset)
    console.log(`  ${asset.status === 'ready' ? '✓' : '✗'} ${asset.id} ${asset.status} (${readyAssets.size}/${muxAssetIds.size})`)
  }
  if (readyAssets.size === muxAssetIds.size) break
  if (Date.now() > deadline) {
    console.error('Timed out waiting for Mux — re-run the script later, created assets will be reused.')
    process.exit(1)
  }
  await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS))
}

// ─── Write mux.videoAsset docs + patch fields ───────────────────────────────

// Same shape sanity-plugin-mux-input writes when importing an existing Mux asset.
const videoAssetDocId = (sanityAssetId) => `mux-asset-${sanityAssetId}`
const muxVideoValue = (sanityAssetId) => ({
  _type: 'mux.video',
  asset: { _type: 'reference', _weak: true, _ref: videoAssetDocId(sanityAssetId) },
})

let failed = 0
for (const [sanityAssetId, source] of sources) {
  const asset = readyAssets.get(source.key)
  if (asset?.status !== 'ready') continue
  await client.createOrReplace({
    _id: videoAssetDocId(sanityAssetId),
    _type: 'mux.videoAsset',
    assetId: asset.id,
    playbackId: asset.playback_ids?.find((p) => p.policy === 'public')?.id,
    filename: units.get(source.key).filename,
    status: asset.status,
    data: asset,
  })
}

console.log('\n💾 patching documents')
const results = []
for (const t of targets) {
  const asset = readyAssets.get(sources.get(t.source.assetId).key)
  const playbackId = asset?.playback_ids?.find((p) => p.policy === 'public')?.id
  // muxMp4Url() in the frontend points the loop players at highest.mp4
  const mp4Ready = asset?.static_renditions?.files?.some((f) => f.name === 'highest.mp4' && f.status === 'ready')
  if (asset?.status !== 'ready' || !playbackId || !mp4Ready) {
    failed++
    const status = asset?.status !== 'ready' ? (asset?.status ?? 'missing') : !mp4Ready ? 'no highest.mp4' : 'no playback id'
    results.push({ target: t.label, playbackId: '—', status })
    continue
  }

  if (t.kind === 'category') {
    const baseId = t.docId.replace(/^drafts\./, '')
    const videoDocId = `video-showreel-${baseId}`
    await client.createIfNotExists({
      _id: videoDocId,
      _type: 'video',
      title: `${t.category.title} — Showreel`,
      muxVideo: muxVideoValue(t.source.assetId),
      // legacy file kept so the currently deployed frontend can still play it via featuredVideo
      file: t.category.fileRef,
    })
    await client
      .patch(t.docId)
      .set({ featuredVideo: { _type: 'reference', _ref: videoDocId } })
      .commit()
  } else {
    await client
      .patch(t.docId)
      .set({ [t.path]: muxVideoValue(t.source.assetId) })
      .commit()
  }
  results.push({ target: t.label, playbackId, status: 'migrated' })
}

console.table(results)
console.log(failed ? `\n${failed} field(s) failed — fix in Mux/Sanity and re-run.` : '\nDone.')
process.exit(failed ? 1 : 0)
