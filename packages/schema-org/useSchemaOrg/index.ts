import { inject } from 'vue-demi'
import type { SchemaOrgClient } from '../createSchemaOrg'
import { PROVIDE_KEY } from '../createSchemaOrg'
import type { NodeResolver } from '../utils'
import type { MaybeRef, Thing } from '../types'

export function useSchemaOrg(resolvers: MaybeRef<NodeResolver<any>|Thing|Record<string, any>>[] = []): UseSchemaOrgReturn {
  const client = inject<SchemaOrgClient>(PROVIDE_KEY)

  if (!client)
    throw new Error('[vueuse-schema-org] Failed to find plugin, you may have forgotten to apply app.use(schemaOrg)')

  if (!resolvers.length)
    return client

  client.resolveAndMergeNodes(resolvers)
  client.update()
  return client
}

export type UseSchemaOrgReturn = SchemaOrgClient
