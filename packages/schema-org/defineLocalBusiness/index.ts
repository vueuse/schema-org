import type { SchemaNodeInput } from '../types'
import type { NodeResolver } from '../utils'
import {
  IdentityId,
  defineNodeResolver,
  ensureBase,
  idReference,
  prefixId,
  resolveType,
  setIfEmpty, resolveId,
} from '../utils'
import type { Organization } from '../defineOrganization'
import { defineImage } from '../defineImage'
import { resolveAddress } from '../shared/resolveAddress'
import type { OpeningHoursInput } from '../shared/resolveOpeningHours'
import { resolveOpeningHours } from '../shared/resolveOpeningHours'

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
  openingHoursSpecification?: OpeningHoursInput
}

export type LocalBusinessOptional = '@id'|'@type'|'url'
export type DefineLocalBusinessInput = SchemaNodeInput<LocalBusiness, LocalBusinessOptional>

export type LocalBusinessNodeResolver = NodeResolver<LocalBusiness, LocalBusinessOptional>

/**
 * Describes a business which allows public visitation.
 * Typically, used to represent the business 'behind' the website, or on a page about a specific business.
 */
export function defineLocalBusiness(localBusinessInput: DefineLocalBusinessInput): LocalBusinessNodeResolver {
  return defineNodeResolver<LocalBusiness, LocalBusinessOptional>(localBusinessInput, {
    defaults({ canonicalHost, options }) {
      return {
        '@type': ['Organization', 'LocalBusiness'],
        '@id': prefixId(canonicalHost, IdentityId),
        'url': canonicalHost,
        'currenciesAccepted': options.defaultCurrency,
      }
    },
    resolve(localBusiness, { canonicalHost }) {
      resolveType(localBusiness, ['Organization', 'LocalBusiness'])
      resolveAddress(localBusiness, 'address')
      resolveOpeningHours(localBusiness, 'openingHoursSpecification')
      resolveId(localBusiness, canonicalHost)
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
}
