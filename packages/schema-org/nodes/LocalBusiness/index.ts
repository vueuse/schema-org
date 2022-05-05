import type { DeepPartial } from 'utility-types'
import type { SchemaNodeInput } from '../../types'
import {
  IdentityId,
  defineSchemaResolver,
  prefixId,
  resolveId, resolveType,
} from '../../utils'
import type { Organization } from '../Organization'
import type { RelatedAddressInput } from '../PostalAddress'
import { resolveAddress } from '../PostalAddress'
import type { OpeningHoursInput } from '../OpeningHours'
import { resolveOpeningHours } from '../OpeningHours'
import type { SingleImageInput } from '../Image'
import { resolveImages } from '../Image'
import { defineSchemaOrgComponent } from '../../components/defineSchemaOrgComponent'

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
  '@type': ['Organization', 'LocalBusiness'] | ['Organization', 'LocalBusiness', ValidLocalBusinessSubTypes] | ValidLocalBusinessSubTypes
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
  defineLocalBusiness(input as LocalBusiness)

/**
 * Describes a business which allows public visitation.
 * Typically, used to represent the business 'behind' the website, or on a page about a specific business.
 */
export function defineLocalBusiness<T extends SchemaNodeInput<LocalBusiness>>(input: T) {
  return defineSchemaResolver<T, LocalBusiness>(input, {
    required: [
      'name',
    ],
    defaults({ canonicalHost, options }) {
      return {
        '@id': prefixId(canonicalHost, IdentityId),
        'url': canonicalHost,
        'currenciesAccepted': options.defaultCurrency,
      }
    },
    resolve(node, client) {
      if (node['@type'])
        node['@type'] = resolveType(node['@type'], ['Organization', 'LocalBusiness']) as ['Organization', 'LocalBusiness', ValidLocalBusinessSubTypes]
      // @todo fix type
      if (node.address)
        node.address = resolveAddress(client, node.address) as RelatedAddressInput
      // @todo fix type
      if (node.openingHoursSpecification)
        node.openingHoursSpecification = resolveOpeningHours(client, node.openingHoursSpecification) as OpeningHoursInput[]

      if (node.logo) {
        node.logo = resolveImages(client, node.logo, {
          mergeWith: {
            '@id': prefixId(client.canonicalHost, '#logo'),
            'caption': node.name,
          },
        }) as SingleImageInput
      }
      resolveId(node, client.canonicalHost)
      return node
    },
  })
}

export const SchemaOrgLocalBusiness = defineSchemaOrgComponent('SchemaOrgLocalBusiness', defineLocalBusiness)
