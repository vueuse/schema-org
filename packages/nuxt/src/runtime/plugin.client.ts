import { createSchemaOrg, handleNodesCSR, useVueUseHead } from '@vueuse/schema-org'
import { defineNuxtPlugin } from '#app'
import { useRoute } from '#imports'
import meta from '#build/schemaOrg.config.mjs'

export default defineNuxtPlugin((nuxtApp) => {
  const head = nuxtApp.vueApp._context.provides.usehead
  const client = createSchemaOrg({
    provider: {
      useRoute,
      setupDOM: useVueUseHead(head),
      name: 'nuxt',
    },
    ...meta.config,
  })

  nuxtApp._useSchemaOrg = (input) => {
    return handleNodesCSR(client, input)
  }
  nuxtApp.vueApp.use(client)
})
