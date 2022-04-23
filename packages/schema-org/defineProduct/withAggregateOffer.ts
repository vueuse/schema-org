import type { Optional } from 'utility-types'
import { defu } from 'defu'
import type { IdReference, Thing } from '../types'
import { setIfEmpty } from '../utils'
import type { ProductNodeResolver } from './index'

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

export type WithAggregateOfferInput = Optional<AggregateOffer, 'priceCurrency'|'offerCount'>

export function withAggregateOffer(resolver: ProductNodeResolver) {
  return (aggregateOfferInput: WithAggregateOfferInput) => {
    const aggregateOffer = defu(aggregateOfferInput, {
      '@type': 'AggregateOffer',
    }) as AggregateOffer
    setIfEmpty(aggregateOffer, 'offerCount', aggregateOfferInput.offers.length)
    resolver.append.push(() => {
      return {
        aggregateOffer,
      }
    })
    return resolver
  }
}
