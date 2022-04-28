import { inject } from 'vue-demi'
import type { SchemaOrgClient } from '../createSchemaOrg'
import { PROVIDE_KEY } from '../createSchemaOrg'
import type { ResolvedNodeResolver } from '../utils'
import type { Arrayable, MaybeRef, Thing } from '../types'

export type UseSchemaOrgInput = MaybeRef<ResolvedNodeResolver<any>|Thing|Record<string, any>>

export function useSchemaOrg(input: Arrayable<UseSchemaOrgInput> = []): UseSchemaOrgReturn {
  const client = inject<SchemaOrgClient>(PROVIDE_KEY)

  if (!client)
    throw new Error('[@vueuse/schema-org] Failed to find plugin, you may have forgotten to apply app.use(schemaOrg)')

  if (!Array.isArray(input))
    input = [input]

  if (!input.length)
    return client

  client.resolveAndMergeNodes(input as UseSchemaOrgInput[])
  client.update()
  return client
}

export type UseSchemaOrgReturn = SchemaOrgClient
