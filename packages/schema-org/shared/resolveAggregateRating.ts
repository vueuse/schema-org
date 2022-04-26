import { defu } from 'defu'
import type { IdReference, SchemaNodeInput, Thing } from '../types'
import { resolver } from '../utils'
import type { AggregateOffer } from './resolveAggregateOffer'

export interface AggregateRating extends Thing {
  '@type': 'AggregateRating'
  /**
   * The total number of ratings for the item on your site. At least one of ratingCount or reviewCount is required.
   */
  ratingCount: number
  /**
   * Specifies the number of people who provided a review with or without an accompanying rating. At least one of ratingCount or reviewCount is required.
   */
  reviewCount: number
  /**
   * A numerical quality rating for the item, either a number, fraction, or percentage
   * (for example, "4", "60%", or "6 / 10").
   * Google understands the scale for fractions and percentages,
   * since the scale is implied in the fraction itself or the percentage.
   * The default scale for numbers is a 5-point scale, where 1 is the lowest value and 5 is the highest value.
   * If another scale is intended, use bestRating and worstRating.
   */
  ratingValue: number|string
  /**
   * The highest value allowed in this rating system. If bestRating is omitted, 5 is assumed.
   */
  bestRating?: number
  /**
   * The lowest value allowed in this rating system. If worstRating is omitted, 1 is assumed.
   */
  worstRating?: number
}

export type AggregateRatingInput = SchemaNodeInput<AggregateRating, '@id'|'@type'|'reviewCount'>|IdReference

export function resolveAggregateRating(input: AggregateRatingInput) {
  return resolver<AggregateRatingInput, AggregateRating>(input, (input) => {
    return defu(input as unknown as AggregateOffer, {
      '@type': 'AggregateRating',
    }) as AggregateOffer
  })
}
