import { inject, onBeforeUnmount } from 'vue-demi'
import type { SchemaOrgClient } from '../createSchemaOrg'
import { PROVIDE_KEY } from '../createSchemaOrg'
import type { ResolvedNodeResolver } from '../utils'
import type { Arrayable, Thing } from '../types'

export type UseSchemaOrgInput = ResolvedNodeResolver<any> | Thing | Record<string, any>

const IS_BROWSER = typeof window !== 'undefined'

export function injectSchemaOrg() {
  const schemaOrg = inject<SchemaOrgClient>(PROVIDE_KEY)

  if (!schemaOrg)
    throw new Error('[@vueuse/schema-org] Failed to find plugin, you may have forgotten to apply app.use(schemaOrg)')

  return schemaOrg
}

export function useSchemaOrg(input: Arrayable<UseSchemaOrgInput> = []) {
  const schemaOrg = injectSchemaOrg()

  const nodeIds = schemaOrg.addResolvedNodeInput(input)
  schemaOrg.generateSchema()

  if (IS_BROWSER) {
    // clean up nodes on unmount
    onBeforeUnmount(() => {
      schemaOrg.debug('useSchemaOrg onBeforeUnmount removeNodes', nodeIds)
      nodeIds.forEach(nodeId => schemaOrg.removeNode(nodeId))
      schemaOrg.generateSchema()
    })
  }
}
