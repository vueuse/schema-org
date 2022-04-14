import type { OptionalMeta, Thing } from '../types'
import { defineNodeResolverSchema, setIfEmpty } from '../utils'

export interface Offer extends Thing {
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
  priceSpecification: unknown
}

/**
 * Describes an offer for a Product (typically prices, stock availability, etc).
 */
export function defineOffer(offer: OptionalMeta<Offer>) {
  return defineNodeResolverSchema(offer, {
    defaults: {
      '@type': 'Offer',
    },
    resolve(webPage, { routeCanonicalUrl }) {
      setIfEmpty(webPage, 'url', routeCanonicalUrl())
      return webPage
    },
  })
}
