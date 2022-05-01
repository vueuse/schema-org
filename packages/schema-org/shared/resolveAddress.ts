import { defu } from 'defu'
import { hash } from 'ohash'
import type { Arrayable, IdReference, SchemaNodeInput, Thing } from '../types'
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

export type AddressInput = SchemaNodeInput<PostalAddress> | IdReference

export function resolveAddress(input: Arrayable<AddressInput>) {
  return resolver<AddressInput, PostalAddress>(input, (input, { canonicalHost }) => {
    return defu(input as unknown as PostalAddress, {
      '@type': 'PostalAddress',
      '@id': prefixId(canonicalHost, `#/schema/address/${hash(input)}`),
    }) as PostalAddress
  })
}
