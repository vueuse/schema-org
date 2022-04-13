import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { defineNuxtConfig } from 'nuxt3'
import Module from '../../packages/nuxt/src/module'
import {defineOrganization, defineWebPage, defineWebSite} from "@vueuse/schema-org";

const __dirname = dirname(fileURLToPath(import.meta.url))

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  alias: {
    '@vueuse/schema-org': resolve(__dirname, '../../packages/schema-org/index.ts'),
    '@vueuse/schema-org-components': resolve(__dirname, '../../packages/components/index.ts'),
  },
  modules: [
    Module,
    'nuxt-windicss',
  ],
  schemaOrg: {
    canonicalHost: 'https://v3.nuxtjs.org/',
    // publisher: defineOrganization({
    //   name: 'Nuxt.js',
    //   logo: defineImageObject({
    //     '@id': 'https://v3.nuxtjs.org/#logo',
    //     'url': 'https://vueuse.js.org/logo.png',
    //     'width': '200',
    //     'height': '200',
    //     'inLanguage': 'en_US',
    //     'caption': 'Nuxt.js',
    //   }),
    //   sameAs: [
    //     'https://twitter.com/nuxt_js',
    //   ],
    // }),
  },
})
