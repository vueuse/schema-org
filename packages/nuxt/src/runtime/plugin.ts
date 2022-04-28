import { createSchemaOrg } from '@vueuse/schema-org'
import { defineNuxtPlugin } from '#app'
import { useHead, useRoute } from '#imports'
import meta from '#build/schemaOrg.config.mjs'

export default defineNuxtPlugin((nuxtApp) => {
  const schemaOrg = createSchemaOrg({
    useHead,
    useRoute,
    ...meta.config,
  })
  nuxtApp.vueApp.use(schemaOrg)
})
