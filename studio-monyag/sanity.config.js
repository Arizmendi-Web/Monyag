import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemaTypes'

// Check if Cloudflare is building the simplified client version
const isClientBuild = process.env.SANITY_STUDIO_CLIENT_MODE === 'true'

export default defineConfig({
  name: 'default',
  title: 'MonyAg',

  projectId: 'zjh62d7j',
  dataset: 'production',

  // Include Vision tool for your dev/sanity.io builds, but omit for client
  plugins: isClientBuild ? [structureTool()] : [structureTool(), visionTool()],

  // Hide top navbar only on the client build
  studio: {
    components: {
      navbar: isClientBuild ? () => null : undefined,
    },
  },

  schema: {
    types: schemaTypes,
  },
})