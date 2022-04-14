import type { OptionalMeta, Thing } from '../types'
import { defineNodeResolverSchema, idReference, setIfEmpty } from '../utils'
import { IdentityId } from '../defineIdentity'

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

export const PostalAddressId = 'address'

/**
 * Describes the postal address of a place; usually in the context of a LocalBusiness.
 */
export function definePostalAddress(postalAddress: OptionalMeta<PostalAddress>) {
  return defineNodeResolverSchema(postalAddress, {
    defaults: {
      '@type': 'PostalAddress',
      '@id': PostalAddressId,
    },
    mergeRelations(node, { findNode }) {
      const identity = findNode(IdentityId)

      if (identity && identity['@type'] === 'Organization')
        setIfEmpty(identity, 'address', idReference(node))

      return node
    },
  })
}
