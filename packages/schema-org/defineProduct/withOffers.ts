import { defu } from 'defu'
import type { Optional } from 'utility-types'
import type { ProductNodeResolver } from './index'

export interface Offer {
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

export type WithOfferInput = Optional<Offer, '@type'|'availability'|'priceCurrency'>
export type WithOffersInput = WithOfferInput[]

/**
 * Describes an offer for a Product (typically prices, stock availability, etc).
 */
export function withOffers(resolver: ProductNodeResolver) {
  return (offersInput: WithOffersInput) => {
    resolver.append.push(
      ({ canonicalUrl, options }) => ({
        offers: offersInput.map((offerInput) => {
          return defu(offerInput, {
            '@type': 'Offer',
            'priceCurrency': options.defaultCurrency,
            'availability': 'https://schema.org/InStock',
            'url': canonicalUrl,
          }) as Offer
        }),
      }),
    )
    return resolver
  }
}
