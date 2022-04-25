import { defu } from 'defu'
import { hash } from 'ohash'
import type { Arrayable, IdReference, SchemaNodeInput, Thing } from '../types'
import { prefixId, resolver } from '../utils'
import type { Product } from '../defineProduct'
import type { AuthorInput } from './resolveAuthors'
import { resolveAuthor } from './resolveAuthors'

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
   * The name of the entity being reviewed.
   */
  name?: string
  /**
   * The author of the review.
   */
  author: AuthorInput
  /**
   * An answer object, with a text property which contains the answer to the question.
   */
  reviewRating: Rating
  /**
   * The language code for the question; e.g., en-GB.
   */
  inLanguage?: string
  /**
   * The date that the review was published, in ISO 8601 date format.
   */
  datePublished?: string|Date
}

export type ReviewInput = Arrayable<SchemaNodeInput<Review, '@type'>|IdReference>

/**
 * Describes an offer for a Product (typically prices, stock availability, etc).
 */
export function resolveReviews<T extends Product>(node: T, field: keyof T) {
  if (node[field]) {
    node[field] = resolver(node[field], (input, { options, canonicalHost }) => {
      const review = defu(input as unknown as Review, {
        '@type': 'Review',
        '@id': prefixId(canonicalHost, `#/schema/review/${hash(input)}`),
        'inLanguage': options.defaultLanguage,
      }) as Review

      resolveAuthor(review, 'author')
      return review
    })
  }
}
