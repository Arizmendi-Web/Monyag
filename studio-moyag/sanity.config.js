import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'MonyAg',

  projectId: 'zjh62d7j',
  dataset: 'production',

  // Only load the structure tool (removes visionTool)
  plugins: [structureTool()],

  // Ensure only the structure tool shows up top
  tools: (prev) => prev.filter((tool) => tool.name === 'structure'),

  // Hide the top navbar so the workspace dropdown and "Manage project" link are gone
  studio: {
    components: {
      navbar: () => null,
    },
  },

  schema: {
    types: schemaTypes,
  },
})