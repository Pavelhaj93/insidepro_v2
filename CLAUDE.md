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
- Motion: framer-motion 12, lenis (smooth scroll), embla-carousel, ogl (WebGL shaders/displacement)
- Resend (contact form email), @svgr/webpack (SVG imports as components via Turbopack rule)

## Layout
- `src/app/` — routes: `/` (homepage = page with `isHomepage == true`), `/[slug]` (generic pages),
  `/reference` (works grid, `?category=` filter), `/reference/[slug]` (case study for `project` or `film`),
  `/api/contact` (Resend), `/api/draft-mode/{enable,disable}`, `robots.ts`, `sitemap.ts`
- `src/app/poc/*`, `src/app/reference/[slug]/poc` — design POCs (variant switchers); disallowed in robots.txt
- `src/components/SectionRenderer.tsx` — maps Sanity block `_type` to `components/sections/*`
- `src/components/{home,motion,webgl,sections,ui,layout,icons}`, `src/hooks/` (scroll/parallax/reduced-motion)
- `src/sanity/lib/` — `client.ts`, `live.ts` (defineLive), `image.ts` (urlFor), `queries.ts`
- `studio/` — `sanity.config.ts`, `structure.ts`, `src/schemaTypes/`, `migrations/`, `scripts/` (seeds),
  generated `schema.json` + `sanity.types.ts`
- `scripts/` (root) — one-off seed/migration scripts against Content Lake (need write token)

## Commands
- `npm run dev` — Next (localhost:3000) + Studio (`sanity dev`) in parallel (npm-run-all)
- `npm run build` / `npm start` / `npm run lint`
- `npm run studio:build`, `npm run studio:deploy` (Sanity-hosted Studio)
- Typegen: `cd studio && npx sanity schema extract && npm run typegen` (outputs `studio/sanity.types.ts`)
- One-off scripts: `node --env-file=.env.local scripts/<name>.mjs`
- Content migrations: `cd studio && npx sanity migration run <name>`

## Sanity
- projectId `4mvdpq34`, dataset `production`, apiVersion `2024-01-01`
- Studio title "insidePRO"; plugins: presentationTool (preview origin `SANITY_STUDIO_PREVIEW_ORIGIN`,
  draft mode `/api/draft-mode/enable`), structureTool, visionTool, muxInput (`sanity-plugin-mux-input`;
  its Mux token lives in the dataset doc `secrets.mux`, entered via Studio → Videos → Configure plugin)
- Singletons `settings`, `footer` (fixed IDs, no duplicate/delete, hidden from "create new")
- Documents: `page`, `project`, `film`, `teamMember`, `brandLogo`, `category`, `video`, `post`, `settings`, `footer`
- Blocks: hero, splitVideoReveal, servicesList, servicesAccordion, whoWeAre, zoomText, featuredWorks,
  referenceWorks, cta, quote, process, twoColumn, team, filmShowcase, clients, image, infoBox,
  featureCards, richText, logoWall, textBlock, separator, contactForm
- Shared objects: serviceItem, processStep, clientItem, featureCard

## Env vars (names only)
- Next: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_API_READ_TOKEN`,
  `NEXT_PUBLIC_BASE_URL`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL` (optional)
- Scripts: `SANITY_API_WRITE_TOKEN`; `MUX_TOKEN_ID`, `MUX_TOKEN_SECRET` (`scripts/migrate-videos-to-mux.mjs`)
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
- Queries use `groq` tagged templates (not `defineQuery`) and the frontend does not import generated types;
  new queries should use `defineQuery`. `blocksProjection` is shared by homepage, pages and `/reference`.
- Data fetching uses `client.fetch` with `revalidate = 60` (sitemap 3600); `useCdn` only in production.
- `live.ts` passes `SANITY_API_READ_TOKEN` as `browserToken` too — be aware it reaches the browser.
- Contact form sends to `footer.email` from Sanity (single source of truth); fails closed (500) without
  `RESEND_API_KEY` or `footer.email`.
- Project cards use `cardImage` (fallback `coverImage`); `gallery` is case-study only.
- Video is hosted on Mux, not the Sanity CDN (Sanity bandwidth quota). Fields are `mux.video`
  (`video.muxVideo`, `heroSection.backgroundMuxVideo(Mobile)`, `splitVideoRevealSection.muxVideo` /
  `mobileMuxVideo`); queries project a flat `playbackId`. Videos with controls render via
  `components/media/MuxVideoPlayer` (HLS); muted loops keep a plain `<video>` fed by `muxMp4Url()`
  (`sanity/lib/mux.ts`, static `highest.mp4`). Old `file` fields are hidden legacy — delete them once
  the Mux migration is verified in production.
- `FilmShowcaseSection` deliberately does not link the `beyond-tomorrow` related project.
- Next View Transitions are turned off (scroll reset handled by `ScrollResetOnNavigate`).
- Respect `useReducedMotion` / `useWebGLSupport` when adding motion or WebGL.
- Remote images allowed: `cdn.sanity.io`, `images.unsplash.com`; image qualities `[75, 85, 90]`.
- Branches: `main` (default) and `feature/POC-v2` (active work, ahead of main).
