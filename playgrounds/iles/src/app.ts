import { defineApp } from 'iles'
import { installSchemaOrg } from '@vueuse/schema-org-vite/iles-app'

export default defineApp({
  async enhanceApp(ctx) {
    installSchemaOrg(ctx, {
      // override config
    })
  },
})
