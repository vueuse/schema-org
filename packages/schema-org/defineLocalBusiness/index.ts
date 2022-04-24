import type { OptionalMeta, WithAmbigiousFields } from '../types'
import type { NodeResolver } from '../utils'
import { IdentityId, defineNodeResolver, prefixId } from '../utils'
import type { Organization, OrganizationOptional } from '../defineOrganization'
import type { WithAddressInput } from '../shared/withAddress'
import { withAddress } from '../shared/withAddress'
import type { WithOpeningHoursInput } from '../shared/withOpeningHours'
import { withOpeningHours } from '../shared/withOpeningHours'

export interface LocalBusiness extends Organization {
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
  /**
   * The currency accepted.
   */
  currenciesAccepted?: string
}

export type LocalBusinessOptional = '@id'|'@type'|'url'
export type DefineLocalBusinessInput = OptionalMeta<LocalBusiness, LocalBusinessOptional>|WithAmbigiousFields<LocalBusiness>

export type LocalBusinessNodeResolver = NodeResolver<LocalBusiness, OrganizationOptional> & {
  withAddress: (addressInput: WithAddressInput) => LocalBusinessNodeResolver
  withOpeningHours: (openingHoursInput: WithOpeningHoursInput) => LocalBusinessNodeResolver
}

/**
 * Describes a business which allows public visitation.
 * Typically, used to represent the business 'behind' the website, or on a page about a specific business.
 */
export function defineLocalBusiness(localBusinessInput: DefineLocalBusinessInput): LocalBusinessNodeResolver {
  const resolver = defineNodeResolver<LocalBusiness, OrganizationOptional>(localBusinessInput, {
    defaults({ canonicalHost, options }) {
      return {
        '@type': 'LocalBusiness',
        '@id': prefixId(canonicalHost, IdentityId),
        'url': canonicalHost,
        'currenciesAccepted': options.defaultCurrency,
      }
    },
  })

  const localBusinessResolver = {
    ...resolver,
    withAddress: (addressInput: WithAddressInput) => withAddress(localBusinessResolver)(addressInput),
    withOpeningHours: (openingHoursInput: WithOpeningHoursInput) => withOpeningHours(localBusinessResolver)(openingHoursInput),
  }

  return localBusinessResolver
}
