import { defu } from 'defu'
import { hash } from 'ohash'
import type { DefaultOptionalKeys, IdReference, SchemaNodeInput, Thing } from '../types'
import { prefixId, resolveArrayable, resolveDateToIso } from '../utils'
import type { SchemaOrgContext } from '../createSchemaOrg'

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
  /**
   * The date after which the price is no longer available.
   */
  priceValidUntil?: string | Date
}

export type OfferInput = SchemaNodeInput<Offer, DefaultOptionalKeys | 'availability' | 'priceCurrency'> | IdReference

/**
 * Describes an offer for a Product (typically prices, stock availability, etc).
 */
export function resolveOffers(client: SchemaOrgContext, input: OfferInput[]) {
  return resolveArrayable<OfferInput, Offer>(input, (input) => {
    const offer = defu(input, {
      '@type': 'Offer',
      '@id': prefixId(client.canonicalHost, `#/schema/offer/${hash(input)}`),
      'priceCurrency': client.options.defaultCurrency,
      'availability': 'https://schema.org/InStock',
      'url': client.canonicalUrl,
      'priceValidUntil': new Date(new Date().getFullYear() + 1, 12, -1),
    }) as Offer
    if (offer.priceValidUntil)
      offer.priceValidUntil = resolveDateToIso(offer.priceValidUntil)
    return offer
  })
}
