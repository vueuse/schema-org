import { createSchemaOrg, useVueUseHead } from '@vueuse/schema-org'
import { defineNuxtPlugin } from '#app'
import { useRoute, watch, onBeforeUnmount, getCurrentInstance } from '#imports'
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
    const vm = getCurrentInstance()!
    if (vm.uid)
      client.ctx._ctxUid = vm.uid

    client.ctx.addNode(input)
    client.generateSchema()

    const unwatchRoute = watch(
      () => useRoute(),
      () => {
        client.removeContext(client.ctx._ctxUid)
        client.ctx.addNode(input)
        client.generateSchema()
      })
    // clean up nodes on unmount, client side only
    onBeforeUnmount(() => {
      client.removeContext(client.ctx._ctxUid)
      client.generateSchema()
      unwatchRoute()
    })
  }

  nuxtApp.vueApp.use(client)
})
