import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { defineNuxtConfig } from 'nuxt'

const __dirname = dirname(fileURLToPath(import.meta.url))

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  alias: {
    'nuxt-schema-org': resolve(__dirname, '../../packages/nuxt/src/module.ts'),
  },
  modules: [
    'nuxt-windicss',
    'nuxt-schema-org',
  ],
  // vite: {
  //   plugins: [
  //     Inspect(),
  //   ],
  // },
  schemaOrg: {
    loadClientSide: false,
    debug: true,
    canonicalHost: 'https://harlanshamburgers.com/',
  },
})
