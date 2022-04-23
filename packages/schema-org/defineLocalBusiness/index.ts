import type { IdReference, OptionalMeta } from '../types'
import { IdentityId, defineNodeResolver, prefixId } from '../utils'
import type { Organization } from '../defineOrganization'

export interface LocalBusiness extends Organization {
  /**
   * A reference-by-ID to an PostalAddress piece.
   */
  address: IdReference
  /**
   * The primary public telephone number of the business.
   */
  telephone?: string
  /**
   * The primary public email address of the business.
   */
  email?: string
  /**
   * The primary public fax number of the business.
   */
  faxNumber?: string
  /**
   * The price range of the business, represented by a string of dollar symbols (e.g., $, $$, or $$$ ).
   */
  priceRange?: string
  /**
   * An array of GeoShape, Place or string definitions.
   */
  areaServed?: unknown
  /**
   * An OpeningHoursSpecification object.
   */
  openingHoursSpecification?: unknown
  /**
   * A GeoCoordinates object.
   */
  geo?: unknown
  /**
   * The VAT ID of the business.
   */
  vatID?: string
  /**
   * The tax ID of the business.
   */
  taxID?: string
}

/**
 * Describes a business which allows public visitation.
 * Typically, used to represent the business 'behind' the website, or on a page about a specific business.
 */
export function defineLocalBusiness(localBusiness: OptionalMeta<LocalBusiness>) {
  return defineNodeResolver(localBusiness, {
    defaults({ canonicalHost }) {
      return {
        // @todo @type: Should always be an array of Organization, Place, and the most specific sub-type selected (e.g., ['Organization','Place','Dentist'] ).
        '@type': 'LocalBusiness',
        '@id': prefixId(canonicalHost, IdentityId),
        'url': canonicalHost,
      }
    },
    // @todo When location information is available, the Organization may be eligible for extension into a LocalBusiness type.
  })
}
