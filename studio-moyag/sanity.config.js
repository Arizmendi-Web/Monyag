import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'MonyAg',

  projectId: 'zjh62d7j',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            // Explicitly list ONLY heroSlide in the navigation menu
            S.documentTypeListItem('heroSlide').title('Main Images'),
          ]),
    }),
  ],

  // Ensure only the structure tool is visible
  tools: (prev) => prev.filter((tool) => tool.name === 'structure'),

  // Remove the top navbar
  studio: {
    components: {
      navbar: () => null,
    },
  },

  schema: {
    types: schemaTypes,
  },
})