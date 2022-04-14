import { inject } from 'vue-demi'
import type { MaybeRef } from '@vueuse/shared'
import type { SchemaOrgClient } from '../createSchemaOrg'
import { PROVIDE_KEY } from '../createSchemaOrg'
import type { SchemaOrgNodeResolver } from '../utils'

export function useSchemaOrg(resolvers: MaybeRef<SchemaOrgNodeResolver<any>>[] = []): UseSchemaOrgReturn {
  const client = inject<SchemaOrgClient>(PROVIDE_KEY)

  if (!client)
    throw new Error('You may have forgotten to apply app.use(schemaOrg)')

  if (!resolvers.length)
    return client

  client.resolveAndMergeNodes(resolvers)
  client.update()
  return client
}

export type UseSchemaOrgReturn = SchemaOrgClient
