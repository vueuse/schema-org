import { createSchemaOrg } from '@vueuse/schema-org'
import { computed } from 'vue'
import { defineNuxtPlugin } from '#app'
import { useRoute } from '#imports'
import meta from '#build/schemaOrg.config.mjs'

export default defineNuxtPlugin((nuxtApp) => {
  const head = nuxtApp.vueApp._context.provides.usehead
  let _domSetup = false

  const schemaOrg = createSchemaOrg({
    provider: {
      useRoute,
      setupDOM({ schemaRef }) {
        if (_domSetup)
          return
        head.addHeadObjs(computed(() => {
          return {
            // Can be static or computed
            script: [
              {
                'type': 'application/ld+json',
                'data-id': 'schema-org-graph',
                'key': 'schema-org-graph',
                'children': schemaRef.value,
              },
            ],
          }
        }))

        _domSetup = true
      },
      name: 'nuxt',
    },
    ...meta.config,
  })
  schemaOrg.setupDOM()
  nuxtApp.vueApp.use(schemaOrg)
})
