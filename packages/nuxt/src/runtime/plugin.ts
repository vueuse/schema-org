import { createSchemaOrg, useVueUseHead } from '@vueuse/schema-org'
import { defineNuxtPlugin } from '#app'
import { getCurrentInstance, onBeforeUnmount, useRoute, watch, watchEffect } from '#imports'
import meta from '#build/schemaOrg.config.mjs'

export default defineNuxtPlugin((nuxtApp) => {
  const head = nuxtApp.vueApp._context.provides.usehead
  const schemaOrg = createSchemaOrg({
    provider: {
      useRoute,
      setupDOM: useVueUseHead(head),
      provider: 'nuxt',
    },
    ...meta.config,
  })
  nuxtApp.vueApp.use(schemaOrg)

  let _uid = 0

  nuxtApp._useSchemaOrg = (input) => {
    const vm = getCurrentInstance()

    const ctx = schemaOrg.setupRouteContext(vm?.uid || _uid++)
    schemaOrg.addNodesAndResolveRelations(ctx, input)

    watch(useRoute(),
      () => {
        schemaOrg.removeContext(ctx)
        schemaOrg.addNodesAndResolveRelations(ctx, input)
        schemaOrg.generateSchema()
      })

    // allow computed data to trigger new schema
    watchEffect(() => {
      schemaOrg.generateSchema()
    })

    // clean up nodes on unmount, client side only
    onBeforeUnmount(() => {
      schemaOrg.removeContext(ctx)
      schemaOrg.generateSchema()
    })

    schemaOrg.setupDOM()
  }
})
