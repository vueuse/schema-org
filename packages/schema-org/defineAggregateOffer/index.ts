import type { IdReference, OptionalMeta, Thing } from '../types'
import { defineNodeResolverSchema } from '../utils'

export interface AggregateOffer extends Thing {
  /**
   * The lowest price of the group, omitting any currency symbols, and using '.' to indicate a decimal place.
   */
  lowPrice: number
  /**
   *  The highest price of the group, omitting any currency symbols, and using '.' to indicate a decimal place.
   */
  highPrice: number
  /**
   * The currency used to describe the product price, in a three-letter ISO 4217 format.
   */
  priceCurrency: string
  /**
   * The number of offers in the group
   */
  offerCount: number
  /**
   * An array of Offer pieces, referenced by ID.
   */
  offers: IdReference[]
}

/**
 * Describes an Article on a WebPage.
 */
export function defineAggregateOffer(product: OptionalMeta<AggregateOffer>) {
  return defineNodeResolverSchema<AggregateOffer>(product, {
    defaults: {
      '@type': 'AggregateOffer',
    },
  })
}
