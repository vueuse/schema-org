import type { DeepPartial } from 'utility-types'
import type { SchemaNodeInput, Thing } from '../../types'
import {
  IdentityId,
  defineSchemaResolver,
  prefixId, resolveId,
} from '../../utils'
import { defineSchemaOrgComponent } from '../../components/defineSchemaOrgComponent'

export interface CreativeWork extends Thing {
  '@type': 'CreativeWork'
}

export const defineCreativeWorkPartial = <K>(input?: DeepPartial<CreativeWork> & K) =>
  // hacky way for users to get around strict typing when using custom schema, route meta or augmentation
  defineCreativeWork(input as CreativeWork)

/**
 * Entities that have a somewhat fixed, physical extension.
 */
export function defineCreativeWork<T extends SchemaNodeInput<CreativeWork>>(input: T) {
  return defineSchemaResolver<T, CreativeWork>(input, {
    required: [
      'name',
    ],
    defaults({ canonicalHost }) {
      return {
        '@type': 'CreativeWork',
        '@id': prefixId(canonicalHost, IdentityId),
        'url': canonicalHost,
      }
    },
    resolve(node, client) {
      resolveId(node, client.canonicalHost)
      return node
    },
  })
}

export const SchemaOrgCreativeWork = defineSchemaOrgComponent('SchemaOrgCreativeWork', defineCreativeWork)
