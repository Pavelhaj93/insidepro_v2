# insidePRO v2

A Next.js 15 + Sanity CMS project.

## Stack

- **Next.js 15** — App Router, TypeScript, Tailwind CSS
- **Sanity v3** — Studio at `/studio`, schemas in `src/sanity/schemaTypes/`
- **next-sanity** — Sanity client, live previews

## Getting Started

### 1. Set up Sanity project

If you haven't already, create a Sanity project:

```bash
npx sanity@latest init --env
```

Or manually fill in `.env.local`:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=your_read_token
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 2. Install & run

```bash
npm install
npm run dev
```

- App → http://localhost:3000
- Studio → http://localhost:3000/studio

## Project Structure

```
src/
├── app/
│   ├── page.tsx               # Homepage
│   └── studio/[[...tool]]/    # Sanity Studio
├── sanity/
│   ├── lib/
│   │   ├── client.ts          # Sanity client
│   │   ├── image.ts           # Image URL builder
│   │   └── queries.ts         # GROQ queries
│   └── schemaTypes/
│       ├── documents/
│       │   ├── page.ts
│       │   ├── post.ts
│       │   └── settings.ts
│       └── index.ts
├── sanity.config.ts           # Studio config
└── sanity.cli.ts              # CLI config
```

## Schemas

- **Page** — Generic pages with slug + rich content
- **Post** — Blog posts with image and body
- **Settings** — Global site settings (title, description, logo)
