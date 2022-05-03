import { inject, onBeforeUnmount, watch, watchEffect } from 'vue-demi'
import type { SchemaOrgClient } from '../createSchemaOrg'
import { PROVIDE_KEY } from '../createSchemaOrg'
import type { ResolvedRootNodeResolver } from '../utils'
import type { Arrayable, Thing } from '../types'

export type UseSchemaOrgInput = ResolvedRootNodeResolver<any> | Thing | Record<string, any>

const IS_BROWSER = typeof window !== 'undefined'

export function injectSchemaOrg() {
  const schemaOrg = inject<SchemaOrgClient>(PROVIDE_KEY)

  if (!schemaOrg)
    throw new Error('[@vueuse/schema-org] Failed to find plugin, you may have forgotten to apply app.use(schemaOrg)')

  return schemaOrg
}

export function useSchemaOrg(input: Arrayable<UseSchemaOrgInput> = []) {
  const schemaOrg = injectSchemaOrg()

  const ctx = schemaOrg.setupRouteContext()
  const nodeIds = schemaOrg.addResolvedNodeInput(ctx, input)
  // when route changes, we'll regenerate the schema
  watch(ctx, () => {
    schemaOrg.generateSchema()
  })
  // when any of the schema nodes update, we'll generate new schema
  watchEffect(() => {
    schemaOrg.generateSchema()
  })

  if (IS_BROWSER) {
    // clean up nodes on unmount
    onBeforeUnmount(() => {
      if (nodeIds)
        nodeIds.forEach(nodeId => schemaOrg.removeNode(nodeId))
      schemaOrg.generateSchema()
    })
  }
}
