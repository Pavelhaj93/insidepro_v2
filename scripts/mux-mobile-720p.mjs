/**
 * Swaps the "highest" static MP4 for a lighter "720p" one on mobile-only loop videos
 * (splitVideoRevealSection.mobileMuxVideo, heroSection.backgroundMuxVideoMobile).
 * The homepage mobile clip was a 16 MB 1080×1920 `highest.mp4`; 720p is roughly 40 % of that.
 *
 * Mux can't hold an explicit resolution next to "highest" on one asset, so "highest" is
 * deleted first. Run this only AFTER the frontend with `muxMobileMp4Url()` is deployed —
 * the old frontend hardcodes highest.mp4 and would lose the mobile video. Assets also used
 * where highest.mp4 is still requested (desktop loops, project hover videos) are skipped.
 * Finally the Sanity `mux.videoAsset` doc gets the fresh `data.static_renditions`, which is
 * what the frontend reads to pick 720p.mp4 (until then it keeps serving highest.mp4).
 *
 * Dry run by default. Run: node --env-file=.env.local scripts/mux-mobile-720p.mjs [--apply]
 */

import { createClient } from '@sanity/client'
import Mux from '@mux/mux-node'

const APPLY = process.argv.includes('--apply')
const POLL_INTERVAL_MS = 10_000
const POLL_TIMEOUT_MS = 15 * 60_000

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
  perspective: 'raw',
})
const mux = new Mux({ tokenId: process.env.MUX_TOKEN_ID, tokenSecret: process.env.MUX_TOKEN_SECRET })

const mobileAssetIds = await client.fetch(`array::unique(array::compact(
  *[_type == "page"].blocks[].mobileMuxVideo.asset._ref +
  *[_type == "page"].blocks[].backgroundMuxVideoMobile.asset._ref
))`)

// Places that still request highest.mp4 for an asset.
const highestUsersQuery = `{
  "desktopLoops": *[_type == "page" && (
    $id in blocks[].muxVideo.asset._ref || $id in blocks[].backgroundMuxVideo.asset._ref
  )]._id,
  "hoverVideos": *[_type == "project" && hoverVideo._ref in *[_type == "video" && muxVideo.asset._ref == $id]._id]._id
}`

for (const assetDocId of mobileAssetIds) {
  const doc = await client.getDocument(assetDocId)
  if (!doc?.assetId) {
    console.log(`↷ ${assetDocId}: no Mux assetId, skipped`)
    continue
  }
  const files = doc.data?.static_renditions?.files ?? []
  const label = `${assetDocId} (${doc.playbackId})`
  if (files.some((f) => f.name === '720p.mp4' && f.status === 'ready')) {
    console.log(`✓ ${label}: already has 720p.mp4`)
    continue
  }

  const users = await client.fetch(highestUsersQuery, { id: assetDocId })
  if (users.desktopLoops.length || users.hoverVideos.length) {
    console.log(`↷ ${label}: still needed as highest.mp4 by ${[...users.desktopLoops, ...users.hoverVideos].join(', ')}, skipped`)
    continue
  }

  const asset = await mux.video.assets.retrieve(doc.assetId)
  const highest = asset.static_renditions?.files?.find((f) => f.resolution === 'highest')
  console.log(`→ ${label}: ${highest ? `highest.mp4 ${(Number(highest.filesize) / 1048576).toFixed(1)} MB` : 'no highest'} → 720p.mp4`)
  if (!APPLY) continue

  if (highest) await mux.video.assets.deleteStaticRendition(doc.assetId, highest.id)
  await mux.video.assets.createStaticRendition(doc.assetId, { resolution: '720p' })

  const started = Date.now()
  let fresh
  for (;;) {
    fresh = await mux.video.assets.retrieve(doc.assetId)
    const file = fresh.static_renditions?.files?.find((f) => f.name === '720p.mp4')
    if (file?.status === 'ready') {
      console.log(`  ready: 720p.mp4 ${(Number(file.filesize) / 1048576).toFixed(1)} MB (${file.width}×${file.height})`)
      break
    }
    if (file?.status === 'errored') throw new Error(`${label}: 720p rendition errored`)
    if (Date.now() - started > POLL_TIMEOUT_MS) throw new Error(`${label}: timed out waiting for 720p`)
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS))
  }

  await client.patch(assetDocId).set({ 'data.static_renditions': fresh.static_renditions }).commit()
  console.log(`  Sanity ${assetDocId}: data.static_renditions updated`)
}

if (!APPLY) console.log('\nDry run — re-run with --apply to change Mux + Sanity.')
