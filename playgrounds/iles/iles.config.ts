import { defineConfig } from 'iles'
import { schemaOrgIles } from '@vueuse/schema-org-vite/iles-module'

export default defineConfig({
  siteUrl: 'https://iles-docs.netlify.app/',
  modules: [
    schemaOrgIles({
      // select which types you'd like
      full: false,
    }),
  ],
})
