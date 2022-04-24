# Vue Schema.org LocalBusiness

**Type**: `defineLocalBusiness(localBusiness: LocalBusiness)`

Describes a business which allows public visitation. Typically used to represent the business 'behind' the website, or on a page about a specific business.

## Useful Links

- [LocalBusiness - Schema.org](https://schema.org/LocalBusiness)
- [Local Business Schema Markup - Google Search Central](https://developers.google.com/search/docs/advanced/structured-data/local-business)
- [LocalBusiness - Yoast](https://developer.yoast.com/features/schema/pieces/localBusiness)
- [Choose an Identity - Local Business](/guide/guides/identity.html#local-business)

## Required Config

- **name** (`string`) - The name of the business.
- **address** use the `withAddress` [function](#functions)

## Recommended Config

- **openingHoursSpecification** use the `withOpeningHours` [function](#functions)

### Minimal Example

```ts
defineLocalBusiness({
  name: 'test',
  logo: '/logo.png',
})
  .withAddress({
    addressCountry: 'Australia',
    postalCode: '2000',
    streetAddress: '123 st',
  })
  .withOpeningHours([
    {
      dayOfWeek: 'Saturday',
      opens: '09:30',
      closes: '13:30',
    },
    {
      dayOfWeek: ['Monday', 'Tuesday'],
      opens: '10:30',
      closes: '15:30',
    },
  ])
```

## Functions

- `withAddress(address: PostalAddress)`

  Provides the address for the business.

- `withOpeningHours(openingHourSpecification: OpeningHoursSpecification[])`

  Provides the opening hours for the business.
  

## Defaults

- **@type**: `LocalBusiness`
- **@id**: `${canonicalHost}#identity`
- **url**: `${canonicalHost}` 
- **currenciesAccepted**: `${options.defaultCurrency}` See [global options](/guide/how-it-works.html#global-config)

## Sub-Types

- `AnimalShelter`
- `ArchiveOrganization`
- `AutomotiveBusiness`
- `ChildCare`
- `Dentist`
- `DryCleaningOrLaundry`
- `EmergencyService`
- `EmploymentAgency`
- `EntertainmentBusiness`
- `FinancialService`
- `FoodEstablishment`
- `GovernmentOffice`
- `HealthAndBeautyBusiness`
- `HomeAndConstructionBusiness`
- `InternetCafe`
- `LegalService`
- `Library`
- `LodgingBusiness`
- `MedicalBusiness`
- `ProfessionalService`
- `RadioStation`
- `RealEstateAgent`
- `RecyclingCenter`
- `SelfStorage`
- `ShoppingCenter`
- `SportsActivityLocation`
- `Store`
- `TelevisionStation`
- `TouristInformationCenter`
- `TravelAgency`

## Relation Transforms

[WebPage](/schema/webpage)

- sets default `potentialAction` to `ReadAction`
- sets default `dateModified` to localBusinesss `dateModified`
- sets default `datePublished` to localBusinesss `datePublished`
- sets default `author` to localBusinesss `author`
- sets default `primaryImageOfPage` to localBusinesss first image

## Resolves

- `logo` will be resolved from a string into an ImageObject and added to `image`

- providing a single string of `@type` will convert it to an array `Dentist` -> `['Organization', 'LocalBusiness', 'Dentist']`

```ts
defineLocalBusiness({
  '@type': 'Dentist',
})
```

## Type Definition

```ts
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
}
```
