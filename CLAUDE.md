Business context and decision log: ../clients/insidepro_v2/

# insidePRO v2

Presentation website for insidePRO, a creative / marketing / film production studio
(Czech-language site, `lang="cs"`, production URL `https://www.insidepro.cz` per sitemap/robots).
Heavily animated, scroll-driven showcase: homepage, references (projects + films), case studies,
contact form. All page content is a Sanity page builder (`page.blocks`).

## Stack
- Next.js 16.2.9 (App Router, Turbopack), React 19.2.4, TypeScript 5
- Sanity 6.1 (Studio in `studio/`, own package.json), next-sanity 13, @sanity/client 7
- Tailwind CSS 4 (`src/app/globals.css`), shadcn (`components.json`, style `base-nova`, @base-ui/react, lucide)
- Motion: framer-motion 12, lenis (smooth scroll), embla-carousel
- Resend (contact form email), @svgr/webpack (SVG imports as components via Turbopack rule)
- Vercel Analytics (`@vercel/analytics`, `<Analytics />` mounted in root layout)

## Layout
- `src/app/` — routes: `/` (homepage = page with `isHomepage == true`), `/[slug]` (generic pages),
  `/reference` (works grid, `?category=` filter), `/reference/[slug]` (case study for `project` or `film`),
  `/api/contact` (Resend), `/api/revalidate` (Sanity webhook), `/api/draft-mode/{enable,disable}`,
  `robots.ts`, `sitemap.ts`. All page routes are static (prerendered, cached until invalidated)
- `src/components/SectionRenderer.tsx` — maps Sanity block `_type` to `components/sections/*`
- `src/components/{home,motion,sections,ui,layout,media,icons}`, `src/hooks/` (scroll/parallax/reduced-motion)
- `src/sanity/lib/` — `client.ts`, `live.ts` (defineLive), `image.ts` (urlFor), `queries.ts`
- `studio/` — `sanity.config.ts`, `structure.ts`, `src/schemaTypes/`, `migrations/`, `scripts/` (seeds),
  generated `schema.json` + `sanity.types.ts`
- `scripts/` (root) — one-off seed/migration scripts against Content Lake (need write token)

## Commands
- `npm run dev` — Next (localhost:3000) + Studio (`sanity dev`) in parallel (npm-run-all)
- `npm run build` / `npm start` / `npm run lint`
- `npm run studio:build`, `npm run studio:deploy` (Sanity-hosted Studio at `https://insidepro-v2.sanity.studio`,
  `deployment.appId` pinned in `studio/sanity.cli.ts` so it deploys without prompting)
- Typegen: `cd studio && npx sanity schema extract && npm run typegen` (outputs `studio/sanity.types.ts`)
- One-off scripts: `node --env-file=.env.local scripts/<name>.mjs`
- Content migrations: `cd studio && npx sanity migration run <name>`

## Sanity
- projectId `4mvdpq34`, dataset `production`, apiVersion `2024-01-01`
- Studio title "insidePRO"; plugins: presentationTool (initial preview = `SANITY_STUDIO_PREVIEW_ORIGIN`, else
  localhost under `sanity dev` / `https://www.insidepro.cz` in the deployed build; `allowOrigins` permits both;
  draft mode `/api/draft-mode/enable`, `resolve` in `studio/src/presentation/resolve.ts` maps routes ↔ documents), structureTool, visionTool, muxInput (`sanity-plugin-mux-input`;
  its Mux token lives in the dataset doc `secrets.mux`, entered via Studio → Videos → Configure plugin)
- Singletons `settings`, `footer`, `nsSettings` (fixed IDs, no duplicate/delete, hidden from "create new";
  guarded via `SINGLETON_TYPES` in `studio/structure.ts`)
- Non Shoots: `nsSettings`, `nsPage` (+ objects `nsVideoGrid`, `nsPhotoGallery`) feed the separate `../nonshoots`
  app (nonshoots.com), grouped under "Non Shoots (nonshoots.com)" in the structure. That app also queries
  `film` / `video` fields — check `../nonshoots/src/sanity/lib/queries.ts` before renaming/removing them, then
  `npm run schema:pull && npm run typegen` there.
- Documents: `page`, `project`, `film`, `teamMember`, `brandLogo`, `category`, `video`, `post`, `settings`, `footer`
- Blocks: hero, splitVideoReveal, servicesList, servicesAccordion, whoWeAre, zoomText, featuredWorks,
  referenceWorks, cta, quote, process, twoColumn, team, filmShowcase, clients, image, infoBox,
  featureCards, richText, logoWall, textBlock, separator, contactForm
- Shared objects: serviceItem, processStep, clientItem, featureCard

## Env vars (names only)
- Next: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_API_READ_TOKEN`,
  `NEXT_PUBLIC_BASE_URL`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL` (optional)
- `SANITY_REVALIDATE_SECRET` — shared with the Sanity webhook that calls `/api/revalidate` (Vercel env)
- Scripts: `SANITY_API_WRITE_TOKEN`; `MUX_TOKEN_ID`, `MUX_TOKEN_SECRET` (`scripts/*mux*.mjs`)
- `NEXT_PUBLIC_SANITY_STUDIO_URL` (optional, stega `studioUrl`; defaults to the hosted Studio)
- Studio: `SANITY_STUDIO_PROJECT_ID`, `SANITY_STUDIO_DATASET`, `SANITY_STUDIO_PREVIEW_ORIGIN` (all have defaults)

## Gotchas / conventions
- `next build` type-checks `studio/` too (root tsconfig includes `**/*.ts`), but Vercel installs only the
  root `package.json`. Every package `studio/sanity.config.ts` / schemas import must therefore also be a
  root dependency (`sanity`, `@sanity/vision`, `sanity-plugin-mux-input`) — a local build passes anyway
  because `studio/node_modules` exists on disk.
- Schemas live ONLY in `studio/src/schemaTypes/` (old `src/sanity/schemaTypes/` was removed as dead code;
  the README is outdated — it still says Next 15 and Studio at `/studio`).
- Pages are live only when `isPublished == true` (filtered in GROQ). Unset boolean looks "off" in Studio
  but was previously served — keep the filter in `pageBySlugQuery`/`pagesQuery`; hidden pages 404 + noindex.
- Queries use `groq` tagged templates (not `defineQuery`) and there are no query result types (no query
  TypeGen); new queries should use `defineQuery`. `blocksProjection` is shared by homepage, pages and `/reference`.
- Pages fetch via `fetchSanity<T>()` (`sanity/lib/live.ts`, wraps `sanityFetch`; `T` derived from the props the
  data feeds). Cached with no time limit (`revalidate: false` + Sanity sync tags), invalidated two ways:
  `<SanityLive>` in visitors' browsers (needs CORS origin `https://www.insidepro.cz`, set) and the Sanity
  webhook → `/api/revalidate` (purges the whole site; covers publishes while nobody is online). Without the
  webhook a missed live event leaves pages stale until the next deploy. In `generateStaticParams` pass
  `perspective: 'published', stega: false` (no request scope for `draftMode()`). Exceptions on `client.fetch`:
  `sitemap.ts` (revalidate 3600) and `/api/contact` (always fresh).
- `live.ts` `browserToken` is only sent to the browser in draft mode (next-sanity 13 `defineLive`).
- Visual Editing overlays need stega, which `defineLive` turns on only in draft mode and only because `client.ts` sets
  `stega.studioUrl`. Its custom `filter` skips `accentColor`, `width` and `mux.videoAsset` docs (on top of the default
  filter: `layout`, `slug`, `*Id`, URLs, `email`, `status`, `variant`…). Any new CMS string the code compares, splits,
  measures or puts into CSS/URLs must be skipped there (`STEGA_SKIP_FIELDS`) or passed through `stegaClean` — stega
  is an invisible suffix, so splitting on `stegaClean(needle)` keeps overlays on the haystack.
- Don't read `searchParams` in `/reference` — it makes the route dynamic (no CDN cache); the category filter is
  client state only (the old `?category=` sidebar links are gone).
- Contact form sends to `footer.email` from Sanity (single source of truth); fails closed (500) without
  `RESEND_API_KEY` or `footer.email`. Design "Timecode / Střih" (`ContactFormSection`): edit-timeline clips per
  field, timecode derived from typed chars; plain "Odeslat zprávu" submit (no render wording). Side padding matches `HomeCtaFooter`. `id="kontakt"` is the anchor CTAs link to — one per page.
- Project cards use `cardImage` (fallback `coverImage`); `gallery` is case-study only.
- Video is hosted on Mux, not the Sanity CDN (Sanity bandwidth quota). Fields are `mux.video`
  (`video.muxVideo`, `heroSection.backgroundMuxVideo(Mobile)`, `splitVideoRevealSection.muxVideo` /
  `mobileMuxVideo`); queries project a flat `playbackId`. Videos with controls render via
  `components/media/MuxVideoPlayer` (HLS); muted loops keep a plain `<video>` fed by `muxMp4Url()`
  (`sanity/lib/mux.ts`, static `highest.mp4`). Old `file` fields are hidden legacy — delete them once
  the Mux migration is verified in production.
- `FilmShowcaseSection` deliberately does not link the `beyond-tomorrow` related project.
- Next View Transitions are turned off (scroll reset handled by `ScrollResetOnNavigate`).
- Respect `useReducedMotion` when adding motion.
- Fonts: 2 self-hosted WOFF2 families (Zalando Sans Expanded = display, Atkinson Hyperlegible Next = body,
  `font-body`); Manrope was removed. Not preloaded on purpose — it delayed FCP/LCP on slow mobile.
- Mobile loop videos use `muxMobileMp4Url()`: 720p.mp4 when the asset has it, else highest.mp4. Mux can't hold
  720p next to "highest", so mobile-only assets are swapped by `scripts/mux-mobile-720p.mjs` (run after new
  mobile uploads). `SplitVideoReveal` shows a poster (Studio `posterImage` or Mux first frame) under the video.
- `next/image` `priority` in Next 16 only preloads; pass `fetchPriority="high"` (`SanityImage`) on the LCP image only.
- Empty image slots in galleries are filtered in GROQ (`gallery[defined(asset)]`) — `urlFor()` throws on them.
- Remote images allowed: `cdn.sanity.io`, `images.unsplash.com`; image qualities `[75, 85, 90]`.
- Branches: `main` (default, deploys to production); work goes on `feature/*` / `fix/*` / `perf/*` branches merged via PR.
