import { inject } from 'vue'
import { PROVIDE_KEY } from '../createSchemaOrg'
import type { Arrayable, SchemaOrgClient, UseSchemaOrgInput } from '../types'
import { handleNodesSSR } from './ssr'
import { handleNodesCSR } from './client'

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

  if (typeof window === 'undefined')
    return handleNodesSSR(client, input)

  // if we should client side rendered, we may not need to
  // @todo handle true SSR mode
  return handleNodesCSR(client, input)
}

export * from './client'
export * from './ssr'
