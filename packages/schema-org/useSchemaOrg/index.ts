import { inject, onBeforeUnmount, watchEffect } from 'vue-demi'
import type { SchemaOrgClient } from '../createSchemaOrg'
import { PROVIDE_KEY } from '../createSchemaOrg'
import type { ResolvedRootNodeResolver } from '../utils'
import type { Arrayable, Id, Thing } from '../types'

export type UseSchemaOrgInput = ResolvedRootNodeResolver<any> | Thing | Record<string, any>

export function injectSchemaOrg() {
  const schemaOrg = inject<SchemaOrgClient>(PROVIDE_KEY)

  if (!schemaOrg)
    throw new Error('[@vueuse/schema-org] Failed to find plugin, you may have forgotten to apply app.use(schemaOrg)')

  return schemaOrg
}

export function useSchemaOrg(input: Arrayable<UseSchemaOrgInput> = []) {
  const schemaOrg = injectSchemaOrg()

  let nodeIds = new Set<Id>()
  const ctx = schemaOrg.setupRouteContext()
  // when route changes, we'll regenerate the schema
  watchEffect(() => {
    nodeIds = schemaOrg.addResolvedNodeInput(ctx, input)
    schemaOrg.generateSchema()
  })

  // clean up nodes on unmount
  onBeforeUnmount(() => {
    if (nodeIds)
      nodeIds.forEach(nodeId => schemaOrg.removeNode(nodeId))
    schemaOrg.generateSchema()
  })
}
