import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { presentationTool } from 'sanity/presentation'
import { schemaTypes } from './src/schemaTypes'
import { structure, SINGLETON_TYPES } from './structure'

export default defineConfig({
  name: 'default',
  title: 'insidePRO',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || '4mvdpq34',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  plugins: [
    presentationTool({
      previewUrl: {
        origin: process.env.SANITY_STUDIO_PREVIEW_ORIGIN || 'http://localhost:3000',
        previewMode: { enable: '/api/draft-mode/enable' },
      },
    }),
    structureTool({ structure }),
    visionTool(),
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
