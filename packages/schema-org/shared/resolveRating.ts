import { defu } from 'defu'
import type { Arrayable, IdReference, SchemaNodeInput, Thing } from '../types'
import { resolver } from '../utils'

export interface Rating extends Thing {
  '@type': 'Rating'
  /**
   * A numerical quality rating for the item, either a number, fraction, or percentage
   * (for example, "4", "60%", or "6 / 10").
   * Google understands the scale for fractions and percentages,
   * since the scale is implied in the fraction itself or the percentage.
   * The default scale for numbers is a 5-point scale, where 1 is the lowest value and 5 is the highest value.
   * If another scale is intended, use bestRating and worstRating.
   */
  ratingValue: number | string
  /**
   * The highest value allowed in this rating system. If bestRating is omitted, 5 is assumed.
   */
  bestRating?: number
  /**
   * The lowest value allowed in this rating system. If worstRating is omitted, 1 is assumed.
   */
  worstRating?: number
  /**
   * A title for the review.
   */
  name?: string
  /**
   * The text content of the review.
   */
  reviewBody?: string
}

export type RatingInput = SchemaNodeInput<Rating> | IdReference

export function resolveRating(input: Arrayable<RatingInput>) {
  return resolver<RatingInput, Rating>(input, (input) => {
    return defu(input as unknown as Rating, {
      '@type': 'Rating',
    }) as Rating
  })
}

