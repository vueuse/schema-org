import type { DeepPartial } from 'utility-types'
import type { SchemaNodeInput } from '../types'
import type { NodeResolverOptions } from '../utils'
import {
  IdentityId,
  callAsPartial,
  defineNodeResolver,
  prefixId,
  resolveId, resolveType,
} from '../utils'
import type { Organization } from '../defineOrganization'
import type { AddressInput } from '../shared/resolveAddress'
import { resolveAddress } from '../shared/resolveAddress'
import type { OpeningHoursInput } from '../shared/resolveOpeningHours'
import { resolveOpeningHours } from '../shared/resolveOpeningHours'
import type { SingleImageInput } from '../shared/resolveImages'
import { resolveImages } from '../shared/resolveImages'

type ValidLocalBusinessSubTypes = 'AnimalShelter' |
'ArchiveOrganization' |
'AutomotiveBusiness' |
'ChildCare' |
'Dentist' |
'DryCleaningOrLaundry' |
'EmergencyService' |
'EmploymentAgency' |
'EntertainmentBusiness' |
'FinancialService' |
'FoodEstablishment' |
'GovernmentOffice' |
'HealthAndBeautyBusiness' |
'HomeAndConstructionBusiness' |
'InternetCafe' |
'LegalService' |
'Library' |
'LodgingBusiness' |
'MedicalBusiness' |
'ProfessionalService' |
'RadioStation' |
'RealEstateAgent' |
'RecyclingCenter' |
'SelfStorage' |
'ShoppingCenter' |
'SportsActivityLocation' |
'Store' |
'TelevisionStation' |
'TouristInformationCenter' |
'TravelAgency'

export interface LocalBusiness extends Organization {
  '@type': ['Organization', 'LocalBusiness']|['Organization', 'LocalBusiness', ValidLocalBusinessSubTypes]|ValidLocalBusinessSubTypes
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
  /**
   * The operating hours of the business.
   */
  openingHoursSpecification?: OpeningHoursInput[]
}

export const defineLocalBusinessPartial = <K>(input?: DeepPartial<LocalBusiness> & K) =>
  // hacky way for users to get around strict typing when using custom schema, route meta or augmentation
  callAsPartial(defineLocalBusiness, input)

/**
 * Describes a business which allows public visitation.
 * Typically, used to represent the business 'behind' the website, or on a page about a specific business.
 */
export function defineLocalBusiness<T extends SchemaNodeInput<LocalBusiness>>(input: T, options?: NodeResolverOptions) {
  return defineNodeResolver<T, LocalBusiness>(input, {
    required: [
      'name',
    ],
    defaults({ canonicalHost, options }) {
      return {
        '@type': ['Organization', 'LocalBusiness'],
        '@id': prefixId(canonicalHost, IdentityId),
        'url': canonicalHost,
        'currenciesAccepted': options.defaultCurrency,
      }
    },
    resolve(node, { canonicalHost }) {
      if (node['@type'])
        node['@type'] = resolveType(node['@type'], ['Organization', 'LocalBusiness']) as ['Organization', 'LocalBusiness', ValidLocalBusinessSubTypes]
      // @todo fix type
      if (node.address)
        node.address = resolveAddress(node.address) as AddressInput
      // @todo fix type
      if (node.openingHoursSpecification)
        node.openingHoursSpecification = resolveOpeningHours(node.openingHoursSpecification) as OpeningHoursInput[]

      if (node.logo) {
        node.logo = resolveImages(node.logo, {
          mergeWith: {
            '@id': prefixId(canonicalHost, '#logo'),
            'caption': node.name,
          },
        }) as SingleImageInput
      }
      resolveId(node, canonicalHost)
      return node
    },
  }, options)
}
