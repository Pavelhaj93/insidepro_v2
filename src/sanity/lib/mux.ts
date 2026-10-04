// Static MP4 for the plain <video> loop players (hero, split reveal, hover).
// Every asset is created with the "highest" static rendition — see muxInput()
// in studio/sanity.config.ts and scripts/migrate-videos-to-mux.mjs.
export function muxMp4Url(playbackId: string | undefined): string | undefined {
  return playbackId ? `https://stream.mux.com/${playbackId}/highest.mp4` : undefined;
}
