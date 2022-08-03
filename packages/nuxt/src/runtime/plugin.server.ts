import { createSchemaOrg } from '@vueuse/schema-org'
import { getCurrentInstance } from 'vue-demi'
import { defineNuxtPlugin } from '#app'
import { computed, useRoute } from '#imports'
import meta from '#build/schemaOrg.config.mjs'

export default defineNuxtPlugin((nuxtApp) => {
  const head = nuxtApp.vueApp._context.provides.usehead
  let _domSetup = false

  const client = createSchemaOrg({
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
                'isBodyTag': true,
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
  nuxtApp._useSchemaOrg = (input) => {
    const vm = getCurrentInstance()
    if (vm?.uid)
      client.ctx._ctxUid = vm?.uid
    client.ctx.addNode(input)

    nextTick(() => {
      watch(() => input, () => {
        client.generateSchema()
        client.setupDOM()
      }, {
        immediate: true,
        deep: true,
      })
    })
  }
  nuxtApp.vueApp.use(client)
})
