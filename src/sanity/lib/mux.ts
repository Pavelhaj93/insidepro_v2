// Static MP4 for the plain <video> loop players (hero, split reveal, hover).
// Every asset is created with the "highest" static rendition — see muxInput()
// in studio/sanity.config.ts and scripts/migrate-videos-to-mux.mjs.
export function muxMp4Url(playbackId: string | undefined): string | undefined {
  return playbackId ? `https://stream.mux.com/${playbackId}/highest.mp4` : undefined;
}

// Mobile loops: the lighter 720p MP4 when the asset has one, else "highest".
// Mux can't hold 720p next to "highest" on one asset, so mobile-only assets get
// swapped by scripts/mux-mobile-720p.mjs — new uploads keep "highest" (Studio
// config) until that script runs, and this fallback keeps them playing.
// `renditions` = the asset's ready static rendition names from Sanity
// (`data.static_renditions.files[status == "ready"].name`).
export function muxMobileMp4Url(
  playbackId: string | undefined,
  renditions: string[] | null | undefined,
): string | undefined {
  if (!playbackId) return undefined;
  const name = renditions?.includes("720p.mp4") ? "720p.mp4" : "highest.mp4";
  return `https://stream.mux.com/${playbackId}/${name}`;
}

// First frame (or `time` seconds in) as a poster for loop videos — served by
// Mux's image API, sized via `width` for srcset.
export function muxThumbnailUrl(playbackId: string, width: number, time = 0): string {
  return `https://image.mux.com/${playbackId}/thumbnail.webp?time=${time}&width=${width}`;
}
