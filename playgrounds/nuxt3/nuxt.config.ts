import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { defineNuxtConfig } from 'nuxt'

const __dirname = dirname(fileURLToPath(import.meta.url))

console.log(resolve(__dirname, '../../packages/nuxt/index.ts'))

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  alias: {
    'nuxt-schema-org': resolve(__dirname, '../../packages/nuxt/src/module.ts'),
    'vueuse-schema-org': resolve(__dirname, '../../packages/schema-org/index.ts'),
    'vueuse-schema-org-components': resolve(__dirname, '../../packages/components/index.ts'),
  },
  modules: [
    'nuxt-windicss',
  ],
  schemaOrg: {
    canonicalHost: 'https://harlanshamburgers.com/',
  },

  vite: {
    optimizeDeps: {
      exclude: [
        'vueuse-schema-org',
      ],
    },
  },
})
