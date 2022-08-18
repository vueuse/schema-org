import { resolve } from 'path'
import { defineNuxtConfig } from 'nuxt'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  alias: {
    'nuxt-schema-org': resolve(__dirname, '../../../packages/nuxt/src/module.ts'),
    '@vueuse/schema-org-vite': resolve(__dirname, '../../../packages/vite/src/index.ts'),
  },
  modules: [
    'nuxt-schema-org',
  ],
  schemaOrg: {
    full: true,
    meta: {
      host: 'https://example.com',
    },
  },
  ignore: [
    'nuxt-runtime',
  ],
})
