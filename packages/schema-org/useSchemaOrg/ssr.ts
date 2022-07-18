import { getCurrentInstance, ref, watchEffect } from 'vue'
import type { Arrayable, Id, SchemaOrgClient, UseSchemaOrgInput } from '../types'

let _uid = 0

export function handleNodesSSR(client: SchemaOrgClient, input: Arrayable<UseSchemaOrgInput>) {
  const vm = getCurrentInstance()

  const ctx = client.setupRouteContext(vm?.uid || _uid++)
  const ids = ref(new Set<Id>())
  ids.value = client.addNodesAndResolveRelations(ctx, input)
  // allow computed data to trigger new schema
  watchEffect(() => {
    client.generateSchema()
  })
  return ids
}
