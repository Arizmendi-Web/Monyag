import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemaTypes'

const isClientBuild = process.env.SANITY_STUDIO_CLIENT_MODE === 'true'

export default defineConfig({
  name: 'default',
  title: 'MonyAg',

  projectId: 'zjh62d7j',
  dataset: 'production',

  plugins: isClientBuild ? [structureTool()] : [structureTool(), visionTool()],

  studio: {
    components: {
      navbar: isClientBuild ? () => null : undefined,
    },
  },

  schema: {
    types: schemaTypes,
  },
})