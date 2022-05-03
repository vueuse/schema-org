import { createSchemaOrg } from '@vueuse/schema-org'
import { defineNuxtPlugin } from '#app'
import { useRoute, watchEffect } from '#imports'
import meta from '#build/schemaOrg.config.mjs'

export default defineNuxtPlugin((nuxtApp) => {
  const head = nuxtApp.vueApp._context.provides.usehead
  const schemaOrg = createSchemaOrg({
    useRoute,
    head,
    ...meta.config,
  })
  nuxtApp.vueApp.use(schemaOrg)

  schemaOrg.setupDOM()
  watchEffect(() => { schemaOrg.generateSchema() })
})
