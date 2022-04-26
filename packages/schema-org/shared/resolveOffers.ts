import { defu } from 'defu'
import { hash } from 'ohash'
import type { DefaultOptionalKeys, IdReference, SchemaNodeInput, Thing } from '../types'
import { prefixId, resolver } from '../utils'

export interface Offer extends Thing {
  '@type': 'Offer'
  /**
   * A schema.org URL representing a schema itemAvailability value (e.g., https://schema.org/OutOfStock).
   */
  availability: string
  /**
   * The price, omitting any currency symbols, and using '.' to indicate a decimal place.
   */
  price: number
  /**
   * The currency used to describe the product price, in three-letter ISO 4217 format.
   */
  priceCurrency: string
  /**
   * @todo A PriceSpecification object, including a valueAddedTaxIncluded property (of either true or false).
   */
  priceSpecification?: unknown
}

export type OfferInput = SchemaNodeInput<Offer, DefaultOptionalKeys|'availability'|'priceCurrency'>|IdReference

/**
 * Describes an offer for a Product (typically prices, stock availability, etc).
 */
export function resolveOffers(input: OfferInput[]) {
  return resolver<OfferInput, Offer>(input, (input, { canonicalHost, options, canonicalUrl }) => {
    return defu(input, {
      '@type': 'Offer',
      '@id': prefixId(canonicalHost, `#/schema/offer/${hash(input)}`),
      'priceCurrency': options.defaultCurrency,
      'availability': 'https://schema.org/InStock',
      'url': canonicalUrl,
    }) as Offer
  })
}
