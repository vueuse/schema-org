import { resolve } from 'node:path'
import { defineNuxtConfig } from 'nuxt/config'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  alias: {
    'nuxt-schema-org': resolve(__dirname, '../../../packages/nuxt/src/module.ts'),
    '@vueuse/schema-org/vite': resolve(__dirname, '../../../packages/schema-org/src/plugins/vite'),
  },
  modules: [
    'nuxt-schema-org',
  ],
  schemaOrg: {
    host: 'https://example.com',
  },
  ignore: [
    'nuxt-runtime',
  ],
})
