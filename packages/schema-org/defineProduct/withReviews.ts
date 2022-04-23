import { defu } from 'defu'
import type { Optional } from 'utility-types'
import type { IdReference, Thing } from '../types'
import { useSchemaOrg } from '../useSchemaOrg'

export interface Rating extends Thing {
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
  /**
   * A title for the review.
   */
  name?: string
  /**
   * The text content of the review.
   */
  reviewBody?: string
}

export interface Review extends Thing {
  /**
   * The author of the review.
   */
  author: IdReference
  /**
   * An answer object, with a text property which contains the answer to the question.
   */
  reviewRating: Rating
  /**
   * The language code for the question; e.g., en-GB.
   */
  inLanguage: string
  /**
   * The date that the review was published, in ISO 8601 date format.
   */
  datePublished?: string
}

export type WithReviewsInput = Optional<Review, '@type'>[]

/**
 * Describes a Review. Usually in the context of a Product or an Organization.
 */
export function withReviews(resolver: any) {
  return (reviewsInput: WithReviewsInput) => {
    const { options } = useSchemaOrg()
    resolver.append.push({
      offers: reviewsInput.map((reviewInput) => {
        return defu(reviewInput, {
          '@type': 'Review',
          'inLanguage': options.defaultLanguage,
        }) as Review
      }),
    })
    return resolver
  }
}
