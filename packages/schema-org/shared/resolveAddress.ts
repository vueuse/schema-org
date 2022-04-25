import { defu } from 'defu'
import { hash } from 'ohash'
import type { Arrayable, IdReference, SchemaNodeInput, Thing } from '../types'
import type { Organization } from '../defineOrganization'
import { prefixId, resolver } from '../utils'

export interface PostalAddress extends Thing {
  /**
   * The building number and street (e.g., 123 fake road ).
   */
  streetAddress: string
  /**
   * The postal code.
   */
  postalCode: string
  /**
   * The two-digit country-code representing the country (e.g., US ).
   */
  addressCountry: string
  /**
   * The town, city or equivalent.
   */
  addressLocality?: string
  /**
   * The region or district.
   */
  addressRegion?: string
  /**
   * A PO box number.
   */
  postOfficeBoxNumber?: string
}

export type AddressInput = Arrayable<SchemaNodeInput<PostalAddress>|IdReference>

export function resolveAddress<T extends Organization>(node: T, field: keyof T) {
  if (node[field]) {
    node[field] = resolver(node[field], (input, { canonicalHost }) => {
      return defu(input as unknown as PostalAddress, {
        '@type': 'PostalAddress',
        '@id': prefixId(canonicalHost, `#/schema/address/${hash(input)}`),
      })
    })
  }
}
