/** Shared production-status labels for `film` documents — used by both
 * FilmShowcaseSection's grid cards and the film case-study meta panel on
 * /reference/[slug], so the two stay in sync. */
export const FILM_STATUS_LABELS: Record<string, string> = {
  "in-development": "In Development",
  "in-production": "In Production",
  "in-post-production": "In Post-Production",
  finishing: "Finishing",
  released: "Released",
};
