import { defu } from 'defu'
import type { OptionalMeta, Thing } from '../types'

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

export type WithPostalAddressInput = OptionalMeta<PostalAddress>

export const PostalAddressId = '#address'

/**
 * Describes the postal address of a place; usually in the context of a LocalBusiness.
 */
export function withPostalAddress(resolver: any) {
  return (postalAddressInput: WithPostalAddressInput) => {
    resolver.append.push({
      address: defu(postalAddressInput, {
        '@type': 'PostalAddress',
        '@id': PostalAddressId,
      }) as PostalAddress,
    })
    return resolver
  }
}
