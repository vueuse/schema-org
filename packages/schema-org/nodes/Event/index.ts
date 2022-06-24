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

export interface Event extends Organization {
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

export const defineEventPartial = <K>(input?: DeepPartial<Event> & K) =>
    // hacky way for users to get around strict typing when using custom schema, route meta or augmentation
    defineEvent(input as Event)

/**
 * An event happening at a certain time and location, such as a concert, lecture, or festival.
 *
 * Ticketing information may be added via the "offers" property.
 * Repeated events may be structured as separate Event objects.
 */
export function defineEvent<T extends SchemaNodeInput<Event>>(input: T) {
  return defineSchemaResolver<T, Event>(input, {
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

export const SchemaOrgEvent = defineSchemaOrgComponent('SchemaOrgEvent', defineEvent)
