import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { defineNuxtConfig } from 'nuxt/config'

const __dirname = dirname(fileURLToPath(import.meta.url))

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  ssr: false,
  alias: {
    'nuxt-schema-org': resolve(__dirname, '../../packages/nuxt/src/module.ts'),
  },
  modules: [
    'nuxt-windicss',
    'nuxt-schema-org',
  ],
  schemaOrg: {
    canonicalHost: 'https://example.com',
  },

  experimental: {
    externalVue: true,
  },

  build: {
    transpile: ['@vueuse/schema-org', 'nuxt-schema-org', '@vueuse/head'],
  },

  ignore: [
    'nuxt-runtime',
  ],
  nitro: {
    prerender: {
      crawlLinks: true,
    },
  },
})
