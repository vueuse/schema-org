import { defu } from 'defu'
import type { OptionalMeta, Thing } from '../types'
import type { LocalBusinessNodeResolver } from '../defineLocalBusiness'
import type { OrganizationNodeResolver } from '../defineOrganization'

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

export type WithAddressInput = OptionalMeta<PostalAddress>

/**
 * Describes the postal address of a place; usually in the context of a LocalBusiness.
 */
export function withAddress<T extends OrganizationNodeResolver|LocalBusinessNodeResolver>(resolver: T) {
  return (postalAddressInput: WithAddressInput) => {
    resolver.append.push(() => ({
      address: defu(postalAddressInput, {
        '@type': 'PostalAddress',
      }) as PostalAddress,
    }))
    return resolver
  }
}
