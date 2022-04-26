import { defu } from 'defu'
import { hash } from 'ohash'
import type { Arrayable, IdReference, SchemaNodeInput, Thing } from '../types'
import { prefixId, resolver, setIfEmpty } from '../utils'
import type { OfferInput } from './resolveOffers'
import { resolveOffers } from './resolveOffers'

export interface AggregateOffer extends Thing {
  '@type': 'AggregateOffer'
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
  offers: OfferInput[]
}

export type AggregateOfferInput = SchemaNodeInput<AggregateOffer, '@type'|'priceCurrency'|'offerCount'>|IdReference

export function resolveAggregateOffer(input: Arrayable<AggregateOfferInput>) {
  return resolver<AggregateOfferInput, AggregateOffer>(input, (input, { canonicalHost }) => {
    const aggregateOffer = defu(input as unknown as AggregateOffer, {
      '@type': 'AggregateOffer',
      '@id': prefixId(canonicalHost, `#/schema/aggregate-offer/${hash(input)}`),
    })
    if (aggregateOffer.offers) {
      // @todo fix type
      aggregateOffer.offers = resolveOffers(aggregateOffer.offers) as OfferInput[]
    }

    setIfEmpty(aggregateOffer, 'offerCount', Array.isArray(aggregateOffer.offers) ? aggregateOffer.offers.length : 1)
    return aggregateOffer
  })
}
