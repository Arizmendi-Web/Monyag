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

  studio: {
    components: {
      // Hide top navbar only on the client build
      navbar: isClientBuild ? () => null : undefined,

      // Global layout wrapper to expand empty image upload drop boxes
      layout: (props) => (
        <>
          <style>{`
            /* Target the empty image drop-zone box */
            div[data-testid="file-input-drop-target"],
            div[data-ui="Card"]:has(button[data-testid="file-button"]) {
              min-height: 250px !important;
              display: flex !important;
              flex-direction: column !important;
              justify-content: center !important;
              align-items: center !important;
              padding: 40px 20px !important;
            }

            /* Center inner content inside the drop box */
            div[data-testid="file-input-drop-target"] > div,
            div[data-ui="Card"]:has(button[data-testid="file-button"]) > div {
              width: 100% !important;
              display: flex !important;
              justify-content: center !important;
              align-items: center !important;
            }
          `}</style>
          {props.renderDefault(props)}
        </>
      ),
    },
  },

  schema: {
    types: schemaTypes,
  },
})