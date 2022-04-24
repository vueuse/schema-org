import type { OptionalMeta, WithAmbigiousFields } from '../types'
import type { NodeResolver } from '../utils'
import {
  IdentityId,
  defineNodeResolver,
  ensureBase,
  handleArrayableTypes,
  idReference,
  prefixId,
  setIfEmpty,
} from '../utils'
import type { Organization } from '../defineOrganization'
import type { WithAddressInput } from '../shared/withAddress'
import { withAddress } from '../shared/withAddress'
import type { OpeningHoursSpecification, WithOpeningHoursInput } from '../shared/withOpeningHours'
import { withOpeningHours } from '../shared/withOpeningHours'
import { defineImage } from '../defineImage'

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
  openingHoursSpecification?: OpeningHoursSpecification[]
}

export type LocalBusinessOptional = '@id'|'@type'|'url'
export type DefineLocalBusinessInput = OptionalMeta<LocalBusiness, LocalBusinessOptional>|WithAmbigiousFields<LocalBusiness>

export type LocalBusinessNodeResolver = NodeResolver<LocalBusiness, LocalBusinessOptional> & {
  withAddress: (addressInput: WithAddressInput) => LocalBusinessNodeResolver
  withOpeningHours: (openingHoursInput: WithOpeningHoursInput) => LocalBusinessNodeResolver
}

/**
 * Describes a business which allows public visitation.
 * Typically, used to represent the business 'behind' the website, or on a page about a specific business.
 */
export function defineLocalBusiness(localBusinessInput: DefineLocalBusinessInput): LocalBusinessNodeResolver {
  const resolver = defineNodeResolver<LocalBusiness, LocalBusinessOptional>(localBusinessInput, {
    defaults({ canonicalHost, options }) {
      return {
        '@type': ['Organization', 'LocalBusiness'],
        '@id': prefixId(canonicalHost, IdentityId),
        'url': canonicalHost,
        'currenciesAccepted': options.defaultCurrency,
      }
    },
    resolve(localBusiness) {
      handleArrayableTypes(localBusiness, ['Organization', 'LocalBusiness'])
      return localBusiness
    },
    mergeRelations(localBusiness, { canonicalHost }) {
      // move logo to root schema
      if (typeof localBusiness.logo === 'string') {
        const id = prefixId(canonicalHost, '#logo')
        localBusiness.logo = defineImage({
          '@id': id,
          'url': ensureBase(canonicalHost, localBusiness.logo),
          'caption': localBusiness.name,
        }).resolve()
        setIfEmpty(localBusiness, 'image', idReference(id))
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
