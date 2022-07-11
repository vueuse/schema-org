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
  // keep track of when route changes for server rendered mode
  let _routeChanged = false

  const { serverRendered } = nuxtApp.payload
  // hydrate initial state from document
  if (serverRendered) {
    const rootCtx = client.setupRouteContext(1)
    const schemaOrg = document.querySelector('head script[data-id="schema-org-graph"]')?.innerHTML
    if (schemaOrg) {
      for (const node of JSON.parse(schemaOrg)['@graph'])
        client.addNode(node, rootCtx)
      client.generateSchema()
    }
  }

  nuxtApp._useSchemaOrg = (input) => {
    const vm = getCurrentInstance()
    let ctx = client.setupRouteContext(vm.uid)
    if (!serverRendered || _routeChanged) {
      // initial state will be correct from server, only need to watch for route changes to re-compute
      client.addNodesAndResolveRelations(ctx, input)
      if (!serverRendered)
        client.generateSchema()
    }
    const unwatchRoute = useRouter().afterEach(
      () => {
        ctx = client.setupRouteContext(vm.uid)

        client.removeContext(ctx)
        client.addNodesAndResolveRelations(ctx, input)
        client.generateSchema()

        client.setupDOM()
        _routeChanged = true
      })
    // clean up nodes on unmount, client side only
    onBeforeUnmount(() => {
      client.removeContext(ctx)
      client.generateSchema()
      unwatchRoute()
    })
  }

  if (!serverRendered) {
    // setup initial DOM for SPA
    client.setupDOM()
  }

  nuxtApp.vueApp.use(client)
})
