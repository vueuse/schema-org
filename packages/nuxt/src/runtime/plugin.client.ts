import { defineNuxtPlugin } from '#app'
import { createSchemaOrg, getCurrentInstance, onBeforeUnmount, ref, useRoute, useRouter, useVueUseHead } from '#imports'
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

  let _routeChanged = false
  nuxtApp._useSchemaOrg = (input) => {
    // if we should client side rendered, we may not need to
    const ids = ref(new Set())

    const vm = getCurrentInstance()!
    let ctx = client.setupRouteContext(vm.uid)
    if (!client.serverRendered || _routeChanged) {
      // initial state will be correct from server, only need to watch for route changes to re-compute
      ids.value = client.addNodesAndResolveRelations(ctx, input)
      if (!client.serverRendered)
        client.generateSchema()
    }

    const handleRouteChange = () => {
      ctx = client.setupRouteContext(vm.uid)

      client.removeContext(ctx)
      ids.value = client.addNodesAndResolveRelations(ctx, input)
      client.generateSchema()

      client.setupDOM()
      _routeChanged = true
    }

    const unwatchRoute = useRouter().afterEach(handleRouteChange)
    // clean up nodes on unmount, client side only
    onBeforeUnmount(() => {
      client.removeContext(ctx)
      ids.value = new Set()
      client.generateSchema()
      unwatchRoute()
    })

    return ids
  }
  nuxtApp.vueApp.use(client)
})
