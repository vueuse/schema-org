import type { DeepPartial } from 'utility-types'
import type {SchemaNodeInput, Thing} from '../../types'
import {
  IdentityId,
  defineSchemaResolver,
  prefixId, resolveId,
} from '../../utils'
import { defineSchemaOrgComponent } from '../../components/defineSchemaOrgComponent'
import {PostalAddress, RelatedAddressInput, resolveAddress} from "../PostalAddress";

export interface Place extends Thing {
  '@type': 'Place'
  address?: PostalAddress | string
}

export const definePlacePartial = <K>(input?: DeepPartial<Place> & K) =>
  // hacky way for users to get around strict typing when using custom schema, route meta or augmentation
  definePlace(input as Place)

/**
 * Entities that have a somewhat fixed, physical extension.
 */
export function definePlace<T extends SchemaNodeInput<Place>>(input: T) {
  return defineSchemaResolver<T, Place>(input, {
    required: [
      'name',
    ],
    defaults({ canonicalHost, options }) {
      return {
        '@type': 'Place',
        '@id': prefixId(canonicalHost, IdentityId),
        'url': canonicalHost,
      }
    },
    resolve(node, client) {
      // @todo fix type
      if (node.address)
        node.address = resolveAddress(client, node.address) as RelatedAddressInput
      resolveId(node, client.canonicalHost)
      return node
    },
  })
}

export const SchemaOrgPlace = defineSchemaOrgComponent('SchemaOrgPlace', definePlace)
