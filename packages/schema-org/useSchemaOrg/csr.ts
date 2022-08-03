import { getCurrentInstance, onBeforeUnmount, ref, watch } from 'vue-demi'
import type { SchemaOrgClient } from '../createSchemaOrg'

const _routeChanged = false

export function handleNodesCSR(client: SchemaOrgClient, input: Arrayable<Thing>) {
  const vm = getCurrentInstance()!
  if (vm.uid)
    client.ctx._ctxUid = vm.uid

  if (!client.serverRendered || _routeChanged) {
    // initial state will be correct from server, only need to watch for route changes to re-compute
    client.ctx.addNode(input)
    if (!client.serverRendered)
      client.generateSchema()
  }
  // const unwatchRoute = watch(
  //   () => client.options.provider.name === 'vitepress'
  //     // @ts-expect-error untyped
  //     ? client.options.provider.useRoute().data.relativePath
  //     : client.options.provider.useRoute().path,
  //   () => {
  //     client.ctx._ctxUid = vm.uid
  //
  //     ctx = client.setupRouteContext(vm.uid)
  //
  //     client.removeContext(vm.uid)
  //
  //     client.addNodesAndResolveRelations(ctx, input)
  //     client.generateSchema()
  //
  //     client.setupDOM()
  //     _routeChanged = true
  //   })
  // // clean up nodes on unmount, client side only
  // onBeforeUnmount(() => {
  //   client.removeContext(ctx)
  //   client.generateSchema()
  //   unwatchRoute()
  // })
}
