import { getCurrentInstance, onBeforeUnmount, ref, watch } from 'vue-demi'
import type { Arrayable, Id, SchemaOrgClient, UseSchemaOrgInput } from '../types'

let _routeChanged = false

export function handleNodesCSR(client: SchemaOrgClient, input: Arrayable<UseSchemaOrgInput>) {
  const ids = ref(new Set<Id>())

  const vm = getCurrentInstance()!
  let ctx = client.setupRouteContext(vm.uid)
  if (!client.serverRendered || _routeChanged) {
    // initial state will be correct from server, only need to watch for route changes to re-compute
    ids.value = client.addNodesAndResolveRelations(ctx, input)
    if (!client.serverRendered)
      client.generateSchema()
  }
  const unwatchRoute = watch(
    () => client.options.provider.name === 'vitepress'
      // @ts-expect-error untyped
      ? client.options.provider.useRoute().data.relativePath
      : client.options.provider.useRoute(),
    () => {
      ctx = client.setupRouteContext(vm.uid)

      client.removeContext(ctx)
      ids.value = client.addNodesAndResolveRelations(ctx, input)
      client.generateSchema()

      client.setupDOM()
      _routeChanged = true
    })
  // clean up nodes on unmount, client side only
  onBeforeUnmount(() => {
    client.removeContext(ctx)
    ids.value = new Set<Id>()
    client.generateSchema()
    unwatchRoute()
  })
}
