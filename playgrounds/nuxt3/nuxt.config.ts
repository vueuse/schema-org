import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { defineNuxtConfig } from 'nuxt3'
import Module from '../../packages/nuxt/src/module'

const __dirname = dirname(fileURLToPath(import.meta.url))

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  alias: {
    'vueuse-schema-org': resolve(__dirname, '../../packages/schema-org/index.ts'),
    'vueuse-schema-org-components': resolve(__dirname, '../../packages/components/index.ts'),
  },
  modules: [
    Module,
  ],
  schemaOrg: {
    canonicalHost: 'https://harlanshamburgers.com/',
  },
})
