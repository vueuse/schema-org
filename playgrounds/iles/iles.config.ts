import { defineConfig } from 'iles'
import { SchemaOrgResolver } from '@vueuse/schema-org'

export default defineConfig({
  siteUrl: 'https://iles-docs.netlify.app/',
  modules: [
    {
      name: '@vueuse/schema-org',
      components: {
        resolvers: [
          // adds component auto-imports
          SchemaOrgResolver(),
        ],
      },
    },
  ],

})
