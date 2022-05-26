import { createSchemaOrg, useVueUseHead } from '@vueuse/schema-org'
import { defineNuxtPlugin } from '#app'
import { getCurrentInstance, onBeforeUnmount, useRoute, useRouter } from '#imports'
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

  client.setupDOM()

  nuxtApp._useSchemaOrg = (input) => {
    const vm = getCurrentInstance()
    let ctx = client.setupRouteContext(vm.uid)
    // initial state will be correct from server, only need to watch for route changes to re-compute
    client.addNodesAndResolveRelations(ctx, input)
    client.generateSchema()

    const unwatchRoute = useRouter().afterEach(
      () => {
        ctx = client.setupRouteContext(vm.uid)

        client.removeContext(ctx)
        client.addNodesAndResolveRelations(ctx, input)
        client.generateSchema()

        client.setupDOM()
      })
    // clean up nodes on unmount, client side only
    onBeforeUnmount(() => {
      client.removeContext(ctx)
      client.generateSchema()
      unwatchRoute()
    })
  }

  nuxtApp.vueApp.use(client)
})
