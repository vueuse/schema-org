import { defu } from 'defu'
import type { Optional } from 'utility-types'
import type { ProductNodeResolver } from './index'

export interface AggregateRating {
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

export type WithAggregateRatingInput = Optional<AggregateRating, '@type'|'reviewCount'>

export function withAggregateRating(resolver: ProductNodeResolver) {
  return (aggregateRatingInput: WithAggregateRatingInput) => {
    const aggregateRating = defu(aggregateRatingInput, {
      '@type': 'AggregateRating',
    }) as AggregateRating
    resolver.append.push(() => ({
      aggregateRating,
    }))
    return resolver
  }
}
