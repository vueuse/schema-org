import { getCurrentInstance, inject, onBeforeUnmount, watchEffect } from 'vue-demi'
import type { SchemaOrgClient } from '../createSchemaOrg'
import { PROVIDE_KEY } from '../createSchemaOrg'
import type { ResolvedRootNodeResolver } from '../utils'
import type { Arrayable, Thing } from '../types'

export type UseSchemaOrgInput = ResolvedRootNodeResolver<any> | Thing | Record<string, any>

export function injectSchemaOrg() {
  const schemaOrg = inject<SchemaOrgClient>(PROVIDE_KEY)

  if (!schemaOrg)
    throw new Error('[@vueuse/schema-org] Failed to find plugin, you may have forgotten to apply app.use(schemaOrg)')

  return schemaOrg
}

export function useSchemaOrg(input: Arrayable<UseSchemaOrgInput> = []) {
  const schemaOrg = injectSchemaOrg()

  const vm = getCurrentInstance()
  const ctx = schemaOrg.setupRouteContext(vm!)
  schemaOrg.addResolvedNodeInput(ctx, input)

  // when route changes, we'll regenerate the schema
  watchEffect(() => {
    schemaOrg.generateSchema()
  })

  // clean up nodes on unmount, client side only
  onBeforeUnmount(() => {
    schemaOrg.removeContext(ctx)
    schemaOrg.generateSchema()
  })
}
