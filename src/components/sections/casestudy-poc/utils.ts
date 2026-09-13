import type { PocProject, SanityImage } from "./types";

/**
 * Whatever real images the project actually has (cover + gallery), in order.
 * Not padded/repeated to a fixed count — variants render fewer sections when
 * a project has fewer images instead of forcing a slot count.
 */
export function getPocImages(project: PocProject): SanityImage[] {
  return [
    ...(project.coverImage ? [project.coverImage] : []),
    ...(project.gallery ?? []),
  ];
}
