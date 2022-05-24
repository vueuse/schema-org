import { getCurrentInstance, inject, onBeforeUnmount, watch, watchEffect } from 'vue'
import { PROVIDE_KEY } from '../createSchemaOrg'
import type { Arrayable, SchemaOrgClient, UseSchemaOrgInput } from '../types'

export function injectSchemaOrg() {
  const schemaOrg = inject<SchemaOrgClient>(PROVIDE_KEY)

  if (!schemaOrg)
    throw new Error('[@vueuse/schema-org] Failed to find plugin, you may have forgotten to apply app.use(schemaOrg)')

  return schemaOrg
}

export function useSchemaOrg(input: Arrayable<UseSchemaOrgInput>) {
  let client: SchemaOrgClient
  try {
    client = injectSchemaOrg()
  }
  catch (e) {}
  // @ts-expect-error lazy types
  if (!client)
    return

  const vm = getCurrentInstance()
  const ctx = client.setupRouteContext(vm?.uid || 0)
  client.addNodesAndResolveRelations(ctx, input)

  watch(
    () => client.options.provider.name === 'vitepress'
      // @ts-expect-error untyped
      ? client.options.provider.useRoute().data.relativePath
      : client.options.provider.useRoute(),
    () => {
      client.removeContext(ctx)
      client.addNodesAndResolveRelations(ctx, input)
      client.generateSchema()
    })

  // allow computed data to trigger new schema
  watchEffect(() => {
    client.generateSchema()
  })

  // clean up nodes on unmount, client side only
  onBeforeUnmount(() => {
    client.removeContext(ctx)
    client.generateSchema()
  })
}
