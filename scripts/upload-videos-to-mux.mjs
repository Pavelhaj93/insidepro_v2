/**
 * Uploads local video files to Mux and adds each one to the Sanity Video library
 * (`video` document with `muxVideo`). Nothing is attached to a project/page — pick the
 * videos in Studio afterwards. Same Mux settings as the Studio plugin and the migration.
 * Idempotent: a file whose `video` document already exists is skipped, and a Mux asset that
 * was already uploaded (matched by `passthrough`) is reused. Needs `ffprobe` and `curl`.
 *
 * Run: node --env-file=.env.local scripts/upload-videos-to-mux.mjs "<title>=<path>" ...
 */

import { createClient } from '@sanity/client'
import Mux from '@mux/mux-node'
import { execFileSync } from 'child_process'
import { parse } from 'path'

const POLL_INTERVAL_MS = 10_000
const POLL_TIMEOUT_MS = 45 * 60_000

const items = process.argv.slice(2).map((arg) => {
  const i = arg.indexOf('=')
  if (i < 1) throw new Error(`Expected "<title>=<path>", got: ${arg}`)
  return { title: arg.slice(0, i).trim(), path: arg.slice(i + 1) }
})
if (!items.length) {
  console.error('Usage: node --env-file=.env.local scripts/upload-videos-to-mux.mjs "<title>=<path>" ...')
  process.exit(1)
}
for (const name of ['SANITY_API_WRITE_TOKEN', 'MUX_TOKEN_ID', 'MUX_TOKEN_SECRET']) {
  if (!process.env[name]) {
    console.error(`Missing ${name} in .env.local`)
    process.exit(1)
  }
}

const client = createClient({
  projectId: '4mvdpq34',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})
const mux = new Mux({ tokenId: process.env.MUX_TOKEN_ID, tokenSecret: process.env.MUX_TOKEN_SECRET })

const slug = (s) => s.toLowerCase().normalize('NFD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
for (const item of items) {
  item.filename = parse(item.path).base
  const duration = Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', item.path], { encoding: 'utf8' }))
  // same passthrough convention as migrate-videos-to-mux.mjs
  item.key = `local:${parse(item.path).name.toLowerCase()}:${Math.round(duration * 10)}`
  item.videoDocId = `video-${slug(parse(item.path).name)}`
  item.assetDocId = `mux-asset-${slug(parse(item.path).name)}`
}

const existingDocs = new Set(await client.fetch(`*[_id in $ids]._id`, { ids: items.map((i) => i.videoDocId) }))
const todo = items.filter((i) => {
  if (existingDocs.has(i.videoDocId)) console.log(`↷ already in the Video library: ${i.title}`)
  return !existingDocs.has(i.videoDocId)
})

const existingAssets = new Map()
for await (const asset of mux.video.assets.list({ limit: 100 })) {
  if (asset.passthrough && asset.status !== 'errored' && !asset.test) existingAssets.set(asset.passthrough, asset)
}

for (const item of todo) {
  const existing = existingAssets.get(item.key)
  if (existing) {
    console.log(`↷ reusing Mux asset ${existing.id} for ${item.filename}`)
    item.muxAssetId = existing.id
    continue
  }
  const upload = await mux.video.uploads.create({
    cors_origin: '*',
    new_asset_settings: {
      playback_policies: ['public'],
      video_quality: 'basic',
      max_resolution_tier: '2160p',
      static_renditions: [{ resolution: 'highest' }],
      passthrough: item.key,
      meta: { title: item.filename },
    },
  })
  const started = Date.now()
  console.log(`⇡ uploading ${item.filename}…`)
  execFileSync('curl', ['--fail', '--silent', '--show-error', '-X', 'PUT', '-T', item.path, upload.url])
  for (;;) {
    const u = await mux.video.uploads.retrieve(upload.id)
    if (u.asset_id) {
      item.muxAssetId = u.asset_id
      break
    }
    if (['errored', 'cancelled', 'timed_out'].includes(u.status)) throw new Error(`Mux upload ${u.status}: ${item.filename}`)
    await new Promise((r) => setTimeout(r, 3_000))
  }
  const asset = await mux.video.assets.retrieve(item.muxAssetId)
  if (asset.test) {
    await mux.video.assets.delete(asset.id)
    console.error('✗ Mux created a TEST asset — the account has no payment method. Nothing was written to Sanity.')
    process.exit(1)
  }
  console.log(`＋ created Mux asset ${item.muxAssetId} for ${item.filename} (${Math.round((Date.now() - started) / 1000)} s)`)
}

console.log('\n⏳ waiting for Mux to finish encoding…')
const deadline = Date.now() + POLL_TIMEOUT_MS
let pending = [...todo]
while (pending.length) {
  for (const item of pending) {
    const asset = await mux.video.assets.retrieve(item.muxAssetId)
    const mp4 = asset.static_renditions?.files?.find((f) => f.name === 'highest.mp4')
    if (asset.status === 'errored' || (asset.status === 'ready' && mp4 && mp4.status !== 'preparing')) {
      item.asset = asset
      console.log(`  ${asset.status === 'ready' && mp4.status === 'ready' ? '✓' : '✗'} ${item.title}: ${asset.status}, highest.mp4 ${mp4?.status ?? 'missing'}`)
    }
  }
  pending = pending.filter((i) => !i.asset)
  if (!pending.length) break
  if (Date.now() > deadline) {
    console.error('Timed out waiting for Mux — re-run later, uploaded assets will be reused.')
    process.exit(1)
  }
  await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS))
}

let failed = 0
const results = []
for (const item of todo) {
  const { asset } = item
  const playbackId = asset.playback_ids?.find((p) => p.policy === 'public')?.id
  const mp4Ready = asset.static_renditions?.files?.some((f) => f.name === 'highest.mp4' && f.status === 'ready')
  if (asset.status !== 'ready' || !playbackId || !mp4Ready) {
    failed++
    results.push({ title: item.title, playbackId: '—', duration: '—', status: asset.status })
    continue
  }
  // same mux.videoAsset shape sanity-plugin-mux-input writes
  await client.createOrReplace({
    _id: item.assetDocId,
    _type: 'mux.videoAsset',
    assetId: asset.id,
    playbackId,
    filename: item.filename,
    status: asset.status,
    data: asset,
  })
  await client.createIfNotExists({
    _id: item.videoDocId,
    _type: 'video',
    title: item.title,
    muxVideo: { _type: 'mux.video', asset: { _type: 'reference', _weak: true, _ref: item.assetDocId } },
  })
  results.push({ title: item.title, playbackId, duration: `${Math.round(asset.duration)} s`, status: 'in library' })
}

console.table(results)
console.log(failed ? `\n${failed} video(s) failed — re-run to retry.` : '\nDone.')
process.exit(failed ? 1 : 0)
