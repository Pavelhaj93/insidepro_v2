import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { presentationTool } from 'sanity/presentation'
import { muxInput } from 'sanity-plugin-mux-input'
import { schemaTypes } from './src/schemaTypes'
import { structure, SINGLETON_TYPES } from './structure'

export default defineConfig({
  name: 'default',
  title: 'insidePRO',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || '4mvdpq34',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  plugins: [
    presentationTool({
      // `sanity dev` previews localhost, the deployed Studio previews production;
      // either can be switched to the other from the Presentation URL bar.
      previewUrl: {
        initial:
          process.env.SANITY_STUDIO_PREVIEW_ORIGIN ||
          (process.env.NODE_ENV === 'development'
            ? 'http://localhost:3000'
            : 'https://www.insidepro.cz'),
        previewMode: { enable: '/api/draft-mode/enable' },
      },
      allowOrigins: ['http://localhost:*', 'https://www.insidepro.cz'],
    }),
    structureTool({ structure }),
    visionTool(),
    // basic quality is free to encode on Mux; 'highest' static MP4 feeds the
    // muted loop players (hero, split reveal, hover) that use a plain <video>.
    muxInput({
      video_quality: 'basic',
      max_resolution_tier: '2160p',
      static_renditions: ['highest'],
    }),
  ],
  schema: { types: schemaTypes },
  document: {
    // Singletons: no duplicating/deleting, and hide them from the global "create new" menu
    actions: (input, context) =>
      SINGLETON_TYPES.has(context.schemaType)
        ? input.filter(({ action }) => action !== 'duplicate' && action !== 'delete')
        : input,
    newDocumentOptions: (prev) =>
      prev.filter((template) => !SINGLETON_TYPES.has(template.templateId)),
  },
})
