import { defineNuxtConfig } from 'nuxt'
import { resolvePath } from 'mlly'

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig(async () => {
  const resolve = (s: string) => resolvePath(s, { url: import.meta.url })
  const alias = {
    'nuxt-schema-org': await resolve('nuxt-schema-org'),
    // fix monorepo dependency conflicts
    '@vueuse/schema-org': await resolve('@vueuse/schema-org'),
  }
  return {
    alias,
    modules: [
      'nuxt-windicss',
      'nuxt-schema-org',
    ],
    schemaOrg: {
      debug: true,
      canonicalHost: 'https://harlanshamburgers.com/',
    },
  }
})
